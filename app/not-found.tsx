import Link from 'next/link'

import { pill, SectionTitle } from '@/components/rows'

export default function NotFound() {
  return (
    <section className='mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center px-[clamp(1.25rem,4vw,3rem)] py-28'>
      <SectionTitle as='h1' index='404'>
        Nothing lives here.
      </SectionTitle>
      <p className='mt-5 max-w-xl text-pretty text-xl text-muted-foreground'>
        The link may be old, or the project may have moved. Here&rsquo;s where everything is now.
      </p>
      <div className='mt-8 flex flex-wrap gap-2'>
        <Link href='/' className={pill}>
          Home
        </Link>
        <Link href='/projects' className={pill}>
          Projects
        </Link>
        <Link href='/posts' className={pill}>
          Writing
        </Link>
      </div>
    </section>
  )
}
