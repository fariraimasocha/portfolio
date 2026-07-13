'use server'

import { z } from 'zod'
import { render } from '@react-email/components'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'
import ContactFormEmail from '@/emails/contact-form-email'
import WelcomeEmail from '@/emails/welcome-email'
import connectDB from '@/lib/db'
import Contact from '@/models/Contact'
import Subscriber from '@/models/Subscriber'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>

const FROM_EMAIL = { address: 'hello@fariraimasocha.co.zw', name: 'Farirai Masocha' }
const OWNER_EMAIL = process.env.EMAIL_TO || 'fariraimasocha@gmail.com'

async function sendViaCloudflare(payload: {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  reply_to?: string
}) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_EMAIL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, ...payload }),
    }
  )
  const body = (await res.json()) as { success: boolean; errors?: { message: string }[] }
  if (!res.ok || !body.success) {
    throw new Error(
      `Cloudflare email send failed (${res.status}): ${body.errors?.map((e) => e.message).join('; ') || 'unknown error'}`
    )
  }
}

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data)

  if (result.error) {
    return { error: 'Please check your input and try again.' }
  }

  const { name, email, message } = result.data
  let contactId: string | null = null

  // Store in MongoDB first
  try {
    await connectDB()
    const contact = await Contact.create({
      name,
      email,
      message,
      status: 'pending',
      emailSent: false,
    })
    contactId = contact._id.toString()
  } catch (dbError) {
    console.error('Failed to save contact to MongoDB:', dbError)
    // Continue with email - don't fail the user experience
  }

  // Send notification email to site owner
  try {
    await sendViaCloudflare({
      to: OWNER_EMAIL,
      reply_to: email,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: await render(ContactFormEmail({ name, email, message })),
    })

    // Update MongoDB record that email was sent
    if (contactId) {
      try {
        await Contact.findByIdAndUpdate(contactId, { emailSent: true })
      } catch (updateError) {
        console.error('Failed to update contact emailSent status:', updateError)
      }
    }

    // Send confirmation email to the person who submitted
    try {
      await sendViaCloudflare({
        to: email,
        subject: 'Thank you for reaching out!',
        text: `Hi ${name},\n\nThank you for contacting me. I've received your message and will get back to you soon.\n\nBest regards,\nFarirai Masocha`,
      })
    } catch (confirmError) {
      console.error('Failed to send confirmation email:', confirmError)
      // Non-critical - main submission was successful
    }

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { error: 'Failed to send message. Please try again.' }
  }
}

export async function subscribe(data: NewsletterFormInputs) {
  const result = NewsletterFormSchema.safeParse(data)

  if (result.error) {
    return { error: 'Invalid email address provided.' }
  }

  const { email } = result.data

  // Check if already subscribed in MongoDB
  try {
    await connectDB()
    const existingSubscriber = await Subscriber.findOne({ email })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return { error: 'You are already subscribed to the newsletter!' }
      } else {
        // Reactivate existing subscriber
        existingSubscriber.isActive = true
        existingSubscriber.unsubscribedAt = undefined
        await existingSubscriber.save()
      }
    }
  } catch (dbError) {
    console.error('MongoDB check error:', dbError)
    // Continue - will try to save below anyway
  }

  // Save to MongoDB
  let subscriberId: string | null = null
  try {
    await connectDB()

    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      {
        $set: {
          isActive: true,
          source: 'website',
        },
        $setOnInsert: {
          email,
          subscribedAt: new Date(),
          welcomeEmailSent: false,
        },
      },
      { upsert: true, new: true }
    )
    subscriberId = subscriber._id.toString()
  } catch (dbError) {
    console.error('MongoDB save error:', dbError)
  }

  // Send welcome email
  try {
    await sendViaCloudflare({
      to: email,
      subject: 'Welcome to my newsletter!',
      html: await render(WelcomeEmail()),
      text: 'Welcome to my newsletter! Thanks for subscribing.',
    })

    if (subscriberId) {
      try {
        await Subscriber.findByIdAndUpdate(subscriberId, {
          welcomeEmailSent: true,
        })
      } catch (updateError) {
        console.error('Failed to update welcomeEmailSent:', updateError)
      }
    }
  } catch (emailError) {
    console.error('Welcome email send error:', emailError)
  }

  return { success: true }
}
