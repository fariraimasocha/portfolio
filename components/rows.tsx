import Link from 'next/link'

import type { ProjectMetadata } from '@/lib/projects'
import type { PostMetadata } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

// Shared building blocks for the hairline look: home, /projects, /posts.

export const pill =
  'inline-flex items-center gap-1.5 rounded-full border border-foreground/80 px-5 py-2 font-mono text-sm uppercase tracking-wider transition-colors duration-150 hover:border-[hsl(var(--ink-accent))] hover:bg-accent hover:text-accent-foreground focus-visible:border-[hsl(var(--ink-accent))] focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none'

const row =
  'group grid grid-cols-[1fr_auto] items-baseline gap-x-6 px-1 py-4 transition-colors duration-150 hover:bg-accent/50 sm:grid-cols-[minmax(10rem,16rem)_1fr_auto]'

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className='font-mono text-xs uppercase tracking-widest text-[hsl(var(--ink-accent))]'>
      {'// '}
      {children}
    </span>
  )
}

export function SectionTitle({
  index,
  as: Tag = 'h2',
  children
}: {
  index: string
  as?: 'h1' | 'h2'
  children: React.ReactNode
}) {
  return (
    <div>
      <Label>{index}</Label>
      <Tag
        className={
          Tag === 'h1'
            ? 'mt-3 text-balance text-[clamp(2.25rem,1.4rem+3vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]'
            : 'mt-2 text-balance text-[clamp(1.5rem,1.1rem+1.9vw,2.25rem)] font-semibold leading-tight tracking-tight'
        }
      >
        {children}
      </Tag>
    </div>
  )
}

function Arrow({ char }: { char: string }) {
  return (
    <span
      aria-hidden='true'
      className='font-mono text-xl leading-none text-muted-foreground transition-[transform,color] duration-200 group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-[hsl(var(--ink-accent))]'
    >
      {char}
    </span>
  )
}

export function ProjectRows({ projects }: { projects: ProjectMetadata[] }) {
  return (
    <ul className='hairline-end relative mt-10'>
      {projects.map(project => (
        <li key={project.slug} className='hairline'>
          <Link href={`/projects/${project.slug}`} className={row}>
            <span className='text-[clamp(1.2rem,1rem+0.8vw,1.4rem)] font-semibold leading-8 tracking-tight'>
              {project.title}
            </span>
            <span className='col-start-1 row-start-2 pb-1 text-base leading-snug text-muted-foreground sm:col-start-auto sm:row-start-auto'>
              {project.summary}
            </span>
            <span className='col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto'>
              <Arrow char='↗' />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function PostRows({ posts }: { posts: PostMetadata[] }) {
  return (
    <ul className='hairline-end relative mt-10'>
      {posts.map(post => (
        <li key={post.slug} className='hairline'>
          <Link href={`/posts/${post.slug}`} className={row}>
            <span className='font-mono text-xs uppercase tracking-wider text-muted-foreground tabular-nums sm:pt-1'>
              {post.publishedAt ? formatDate(post.publishedAt) : ''}
            </span>
            <span className='col-start-1 row-start-2 text-lg font-medium leading-snug sm:col-start-auto sm:row-start-auto'>
              {post.title}
            </span>
            <span className='col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto'>
              <Arrow char='→' />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
