'use server'

import { Resend } from 'resend'
import { ContactFormSchema } from '@/lib/schemas'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(data: z.infer<typeof ContactFormSchema>) {
    const result = ContactFormSchema.safeParse(data)
    
    if (!result.success) {
        return { error: 'Invalid form data' }
    }

    try {
        const { name, email, message } = result.data
        
        await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: process.env.EMAIL_TO as string,
            subject: `New message from ${name}`,
            reply_to: email,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        })

        return { success: true }
    } catch (error) {
        return { error: 'Failed to send email' }
    }
}
