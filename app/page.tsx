import Intro from '@/components/intro'
import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default function Home() {

  const content = `
# Hi, I'm Farirai.
`

  return (
    <section className='py-24'>
      <div className='container max-w-4xl'>
        <Intro />
        <MDXRemote source={content} />
      </div>
    </section>
  )
}
