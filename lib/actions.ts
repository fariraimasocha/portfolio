'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'
import ContactFormEmail from '@/emails/contact-form-email'


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
        return { error: 'Invalid input data' }
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!audienceId) {
        console.error('RESEND_AUDIENCE_ID is not set')
        return { error: 'Server configuration error. Please contact support.' }
    }

    try {
        const { email } = result.data
        const { data: resendData, error } = await resend.contacts.create({
            email: email,
            audienceId: audienceId
        })

        if (error) {
            console.error('Resend API error:', error)
            if ('statusCode' in error && error.statusCode === 422) {
                return { error: 'Invalid audience ID. Please check your configuration.' }
            }
            return { error: 'Failed to subscribe. Please try again.' }
        }

        // Send a welcome email
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Farirai Masocha <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to our newsletter!',
            html: '<p>Thank you for subscribing to our newsletter!</p>'
        })

        if (emailError) {
            console.error('Welcome email error:', emailError)
        }

        return { success: true }
    } catch (error) {
        console.error('Subscription error:', error)
        return { error: 'An unexpected error occurred. Please try again later.' }
    }
}
