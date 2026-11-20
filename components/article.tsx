import Image from 'next/image'
import Link from 'next/link'

import MDXContent from '@/components/mdx-content'
import { Label, pill } from '@/components/rows'
import { formatDate } from '@/lib/utils'

// One layout for a single project and a single post.
export default function Article({
  kind,
  title,
  summary,
  image,
  author,
  publishedAt,
  content,
  next
}: {
  kind: 'project' | 'post'
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  content: string
  next?: { href: string; title?: string }
}) {
  return (
    <article className='mx-auto max-w-3xl px-[clamp(1.25rem,4vw,3rem)] pb-24 pt-28'>
      <header>
        <Label>{kind}</Label>
        <h1 className='mt-3 text-balance text-[clamp(2.25rem,1.4rem+3vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]'>
          {title}
        </h1>
        {summary && (
          <p className='mt-5 max-w-2xl text-pretty text-xl text-muted-foreground'>{summary}</p>
        )}
        <p className='mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground tabular-nums'>
          {[author, publishedAt && formatDate(publishedAt)].filter(Boolean).join(' / ')}
        </p>
      </header>

      {image && (
        <div className='relative mt-10 aspect-video w-full overflow-hidden rounded-md border border-foreground/15 bg-card'>
          <Image
            src={image}
            alt={title || ''}
            fill
            priority
            sizes='(min-width: 768px) 768px, 100vw'
            className={kind === 'project' ? 'object-contain object-top' : 'object-cover'}
          />
        </div>
      )}

      <div className='hairline mt-12' aria-hidden='true' />
      <div className='prose prose-lg mt-12 max-w-none'>
        <MDXContent source={content} />
      </div>

      {/* No dead end: every page hands you somewhere to go next */}
      <footer className='hairline mt-20 pt-10'>
        {next && (
          <Link href={next.href} className='group block'>
            <Label>next {kind}</Label>
            <span className='mt-3 flex items-baseline justify-between gap-6 text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] font-semibold leading-tight tracking-tight'>
              {next.title}
              <span
                aria-hidden='true'
                className='font-mono text-2xl text-muted-foreground transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-[hsl(var(--ink-accent))]'
              >
                →
              </span>
            </span>
          </Link>
        )}
        <div className='mt-10 flex flex-wrap gap-2'>
          <Link href={kind === 'project' ? '/projects' : '/posts'} className={pill}>
            {kind === 'project' ? 'All projects' : 'All posts'}
          </Link>
          <Link href='/contact' className={pill}>
            Say hi
          </Link>
        </div>
      </footer>
    </article>
  )
}
