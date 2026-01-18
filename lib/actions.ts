'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'
import ContactFormEmail from '@/emails/contact-form-email'
import WelcomeEmail from '@/emails/welcome-email'
import connectDB from '@/lib/db'
import Contact from '@/models/Contact'
import Subscriber from '@/models/Subscriber'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Farirai Masocha <hello@fariraimasocha.co.zw>'
const OWNER_EMAIL = process.env.EMAIL_TO || 'fariraimasocha@gmail.com'

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
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      replyTo: email,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      react: ContactFormEmail({ name, email, message }),
    })

    if (sendError) {
      console.error('Failed to send notification email:', sendError)
      return { error: 'Failed to send message. Please try again.' }
    }

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
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
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

  const audienceId = process.env.RESEND_AUDIENCE_ID
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
    // Continue - will try to add to Resend anyway
  }

  // Add to Resend Audience (if configured)
  let resendContactId: string | undefined

  if (audienceId) {
    try {
      const { data: contactData, error: contactError } =
        await resend.contacts.create({
          email,
          audienceId,
          unsubscribed: false,
        })

      if (contactError) {
        console.error('Resend API error:', contactError)
        if ('statusCode' in contactError && contactError.statusCode === 422) {
          if (contactError.message?.toLowerCase().includes('already exists')) {
            // Already in Resend - this is fine, continue with MongoDB save
          } else {
            return { error: 'Invalid subscription request. Please try again.' }
          }
        } else {
          return { error: 'Failed to subscribe. Please try again later.' }
        }
      } else if (contactData) {
        resendContactId = contactData.id
      }
    } catch (resendError) {
      console.error('Resend contact creation error:', resendError)
      return { error: 'Failed to subscribe. Please try again later.' }
    }
  } else {
    console.warn('RESEND_AUDIENCE_ID is not set - skipping Resend Audience')
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
          resendContactId,
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
    // Continue - Resend subscription was successful
  }

  // Send welcome email
  try {
    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to my newsletter!',
      react: WelcomeEmail(),
    })

    if (emailError) {
      console.error('Welcome email error:', emailError)
    } else {
      // Update MongoDB that welcome email was sent
      if (subscriberId) {
        try {
          await Subscriber.findByIdAndUpdate(subscriberId, {
            welcomeEmailSent: true,
          })
        } catch (updateError) {
          console.error('Failed to update welcomeEmailSent:', updateError)
        }
      }
    }
  } catch (emailError) {
    console.error('Welcome email send error:', emailError)
  }

  return { success: true }
}
