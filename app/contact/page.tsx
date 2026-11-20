import ContactForm from '@/components/contact-form'
import { SectionTitle } from '@/components/rows'

export const metadata = { title: 'Contact' }

export default function Contact() {
  return (
    <section className='mx-auto max-w-3xl px-[clamp(1.25rem,4vw,3rem)] pb-24 pt-28'>
      <SectionTitle as='h1' index='contact'>
        Let&rsquo;s build something
      </SectionTitle>
      <p className='mt-5 max-w-xl text-pretty text-xl text-muted-foreground'>
        Tell me what you&rsquo;re working on and I&rsquo;ll reply by email.
      </p>
      <ContactForm />
    </section>
  )
}
