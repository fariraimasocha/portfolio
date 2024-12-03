'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'
import ContactFormEmail from '@/emails/contact-form-email'
import WelcomeEmail from '@/emails/welcome-email'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(data: ContactFormInputs) {
    const result = ContactFormSchema.safeParse(data)

    if (result.error) {
        return { error: result.error.format() }
    }

    try {
        const { name, email, message } = result.data
        const { data, error } = await resend.emails.send({
            from: 'fariraimasocha@gmail.com',
            to: [email],
            cc: ['fariraimasocha@gmail.com'],
            subject: 'Contact form submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            react: ContactFormEmail({ name, email, message })
        })

        if (!data || error) {
            throw new Error('Failed to send email')
        }

        return { success: true }
    } catch (error) {
        return { error }
    }
}

export async function subscribe(data: NewsletterFormInputs) {
    const result = NewsletterFormSchema.safeParse(data)

    if (result.error) {
        return { error: 'Invalid email address provided.' }
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!audienceId) {
        console.error('RESEND_AUDIENCE_ID is not set')
        return { error: 'Newsletter subscription is temporarily unavailable.' }
    }

    try {
        const { email } = result.data
        
        // Add contact to audience
        const { error: contactError } = await resend.contacts.create({
            email,
            audienceId,
            unsubscribed: false,
        })

        if (contactError) {
            console.error('Resend API error:', contactError)
            if ('statusCode' in contactError && contactError.statusCode === 422) {
                if (contactError.message?.toLowerCase().includes('already exists')) {
                    return { error: 'You are already subscribed to the newsletter!' }
                }
                return { error: 'Invalid subscription request. Please try again.' }
            }
            return { error: 'Failed to subscribe. Please try again later.' }
        }

        // Send welcome email
        const { error: emailError } = await resend.emails.send({
            from: 'Farirai Masocha <fariraimasocha@gmail.com>',
            to: email,
            subject: 'Welcome to my newsletter!',
            react: WelcomeEmail()
        })

        if (emailError) {
            console.error('Welcome email error:', emailError)
            // Don't return error since the subscription was successful
        }

        return { success: true }
    } catch (error) {
        console.error('Subscription error:', error)
        return { error: 'An unexpected error occurred. Please try again later.' }
    }
}
