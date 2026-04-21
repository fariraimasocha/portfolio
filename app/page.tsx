import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { GithubCalendar } from '@/components/ui/github-calendar'
import { getProjects } from '@/lib/projects'

const FEATURED_SLUGS = ['a-linkgenie-website', 'f-10x', 'e-waitfast']

export default async function Home() {
  const allProjects = await getProjects()
  const projects = allProjects
    .filter(p => FEATURED_SLUGS.includes(p.slug))
    .sort(
      (a, b) => FEATURED_SLUGS.indexOf(a.slug) - FEATURED_SLUGS.indexOf(b.slug)
    )

  return (
    <section className='flex min-h-screen items-center justify-center px-6 font-mono'>
      <div className='flex flex-col gap-12'>
        <div>
          <h1 className='text-foreground'>farirai</h1>
          <p className='text-muted-foreground'>i build things</p>
        </div>

        <ul className='flex flex-col gap-2 text-muted-foreground'>
          {projects.map(project => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className='group inline-flex w-48 items-center justify-between gap-4 border-b border-transparent transition-colors hover:border-current hover:text-foreground'
              >
                <span>{project.title}</span>
                <ArrowUpRight
                  aria-hidden='true'
                  className='size-3.5 opacity-0 transition-opacity group-hover:opacity-100'
                />
              </Link>
            </li>
          ))}
          <li>
            <Link
              href='/projects'
              className='group inline-flex w-48 items-center justify-between gap-4 border-b border-transparent transition-colors hover:border-current hover:text-foreground'
            >
              <span>more projects</span>
              <ArrowUpRight
                aria-hidden='true'
                className='size-3.5 opacity-0 transition-opacity group-hover:opacity-100'
              />
            </Link>
          </li>
          <li>
            <Link
              href='/posts'
              className='group inline-flex w-48 items-center justify-between gap-4 border-b border-transparent transition-colors hover:border-current hover:text-foreground'
            >
              <span>blog</span>
              <ArrowUpRight
                aria-hidden='true'
                className='size-3.5 opacity-0 transition-opacity group-hover:opacity-100'
              />
            </Link>
          </li>
        </ul>

        <div className='overflow-x-auto opacity-70'>
          <GithubCalendar
            username='fariraimasocha'
            colorSchema='gray'
            showTotal={false}
          />
        </div>

        <div className='flex gap-4 text-sm text-muted-foreground'>
          <a
            href='https://github.com/fariraimasocha'
            target='_blank'
            rel='noreferrer noopener'
            className='transition-colors hover:text-foreground'
          >
            gh
          </a>
          <a
            href='https://x.com/fariraimasocha'
            target='_blank'
            rel='noreferrer noopener'
            className='transition-colors hover:text-foreground'
          >
            x
          </a>
          <a
            href='https://www.linkedin.com/in/fariraimasocha'
            target='_blank'
            rel='noreferrer noopener'
            className='transition-colors hover:text-foreground'
          >
            li
          </a>
        </div>
      </div>
    </section>
  )
}
