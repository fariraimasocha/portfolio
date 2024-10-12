import Intro from '@/components/intro'
import React from 'react'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import NewsletterForm from '@/components/newsletter-form'


export default function Home() {


  return (
    <section className='py-24'>
      <div className='container max-w-3xl'>
        <Intro />
        <RecentPosts />
        <RecentProjects />
        <NewsletterForm />
      </div>
    </section>
  )
}
