import Intro from '@/components/intro'
import React from 'react'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import NewsletterForm from '@/components/newsletter-form'
import { GithubCalendar } from '@/components/ui/github-calendar'

export default function Home() {
  return (
    <section className='py-24'>
      <div className='container max-w-3xl'>
        <Intro />
        <div className='mt-16'>
          <h2 className='title mb-6'>GitHub Contributions</h2>
          <div className='overflow-x-auto'>
            <GithubCalendar username='fariraimasocha' colorSchema='gray' />
          </div>
        </div>
        <RecentPosts />
        <RecentProjects />
        <NewsletterForm />
      </div>
    </section>
  )
}
