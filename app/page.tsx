import Intro from '@/components/intro'
import React from 'react'
import RecentPosts from '@/components/recent-posts'

export default function Home() {


  return (
    <section className='py-24'>
      <div className='container max-w-3xl'>
        <Intro />
        <RecentPosts />
      </div>
    </section>
  )
}
