'use client'

import { useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ContactFormSchema } from '@/lib/schemas'
import { sendEmail } from '@/lib/actions'
import { pill } from '@/components/rows'

type Inputs = z.infer<typeof ContactFormSchema>

// Fallback when sending fails. Already public on the old site.
const EMAIL = 'fariraimasocha@gmail.com'

const field =
  'w-full border-b border-foreground/30 bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted-foreground focus:border-[hsl(var(--ink-accent))] aria-[invalid=true]:border-destructive'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className='mt-2 font-mono text-xs text-destructive'>{message}</p>
}

export default function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: { name: '', email: '', message: '' }
  })

  const processForm: SubmitHandler<Inputs> = async data => {
    setFailed(false)
    try {
      const result = await sendEmail(data)
      if (result.error) return setFailed(true)
      setSentTo(data.email)
      reset()
    } catch {
      setFailed(true)
    }
  }

  // Success stays on screen: what happened, and where to go next.
  if (sentTo) {
    return (
      <div role='status' className='hairline mt-12 pt-10'>
        <p className='font-mono text-sm text-[hsl(var(--ink-accent))]'>✓ message sent</p>
        <p className='mt-3 max-w-xl text-pretty text-xl'>
          Thanks. A confirmation is on its way to{' '}
          <span className='font-semibold'>{sentTo}</span>, and I&rsquo;ll reply there.
        </p>
        <div className='mt-8 flex flex-wrap gap-2'>
          <Link href='/#work' className={pill}>
            Back to my work
          </Link>
          <button type='button' onClick={() => setSentTo(null)} className={pill}>
            Send another
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(processForm)} noValidate className='mt-12 grid gap-8'>
      <div className='grid gap-8 sm:grid-cols-2'>
        <label>
          <span className='sr-only'>Name</span>
          <input
            type='text'
            placeholder='Name'
            autoComplete='name'
            aria-invalid={!!errors.name}
            className={field}
            {...register('name')}
          />
          <FieldError message={errors.name?.message} />
        </label>
        <label>
          <span className='sr-only'>Email</span>
          <input
            type='email'
            placeholder='Email'
            autoComplete='email'
            aria-invalid={!!errors.email}
            className={field}
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </label>
      </div>
      <label>
        <span className='sr-only'>Message</span>
        <textarea
          rows={5}
          placeholder='What are you building?'
          aria-invalid={!!errors.message}
          className={`${field} resize-y`}
          {...register('message')}
        />
        <FieldError message={errors.message?.message} />
      </label>

      {/* Failure: what went wrong, the work is safe, and another way through */}
      {failed && (
        <p role='alert' className='border-l-2 border-destructive pl-4 text-base'>
          That didn&rsquo;t send. Your message is still here, so you can try again, or email
          me directly at{' '}
          <a
            href={`mailto:${EMAIL}`}
            className='font-semibold underline decoration-[hsl(var(--ink-accent))] underline-offset-4'
          >
            {EMAIL}
          </a>
          .
        </p>
      )}

      <div>
        <button
          type='submit'
          disabled={isSubmitting}
          className={`${pill} disabled:cursor-wait disabled:opacity-60`}
        >
          {isSubmitting ? 'Sending…' : failed ? 'Try again' : 'Send message'}{' '}
          <span aria-hidden='true'>→</span>
        </button>
      </div>
    </form>
  )
}
