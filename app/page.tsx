import Link from 'next/link'

import DeveloperPortrait from '@/components/developer-portrait'

import HomeTrace from '@/components/home-trace'

import { getProjects } from '@/lib/projects'
import { getPosts } from '@/lib/posts'
import { pill, PostRows, ProjectRows, SectionTitle } from '@/components/rows'

const FEATURED_SLUGS = [
  'gifdrop',
  'a-linkgenie-website',
  'utashi',
  'c-fitmycv',
  'domainflex',
  'f-10x',
  'subit'
]

const SOCIALS = [
  { href: 'https://github.com/fariraimasocha', label: 'GitHub' },
  { href: 'https://x.com/fariraimasocha', label: 'X' },
  { href: 'https://www.linkedin.com/in/fariraimasocha', label: 'LinkedIn' }
]

export default async function Home() {
  const [allProjects, allPosts] = await Promise.all([getProjects(), getPosts()])
  const posts = allPosts.slice(0, 4)
  const featured = FEATURED_SLUGS.map(slug => allProjects.find(p => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  )

  return (
    <HomeTrace>
      {/* ----------------------------------------------------------- hello */}
      <section className='grid min-h-[min(80svh,42rem)] items-center gap-10 pb-10 pt-28 md:grid-cols-[1.2fr_1fr]'>
        <div className='[container-type:inline-size]'>
          <p className='font-mono text-sm text-muted-foreground'>
            <span className='text-[hsl(var(--ink-accent))]'>~/harare</span> $ whoami
          </p>
          <h1 className='mt-4 text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] md:text-[min(3.75rem,12.4cqw)]'>
            Hi, I&rsquo;m Fari.
          </h1>
          <p className='mt-6 max-w-xl text-pretty text-xl text-muted-foreground'>
            A software engineer who likes the part where an idea stops being a document and
            starts being something you can click. I build{' '}
            <span className='text-foreground'>small, sharp products</span>: AI tooling and
            developer utilities that solve one problem properly.
          </p>
          <p className='mt-4 inline-flex items-center gap-2 font-mono text-sm text-muted-foreground'>
            <span className='relative flex size-2'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-[hsl(var(--ink-accent))] opacity-60' />
              <span className='relative inline-flex size-2 rounded-full bg-[hsl(var(--ink-accent))]' />
            </span>
            open to work
          </p>
          <div className='mt-8 flex flex-wrap gap-2'>
            <Link href='#work' className={pill}>
              My work
            </Link>
            <Link href='/contact' className={pill}>
              Say hi
            </Link>
          </div>
        </div>
        <DeveloperPortrait />
      </section>

      {/* ------------------------------------------------------------ work */}
      <section id='work' className='scroll-mt-12 py-20'>
        <SectionTitle index='01 work'>Some things I made</SectionTitle>
        <ProjectRows projects={featured} />
        <p className='mt-6 font-mono text-sm text-muted-foreground'>
          + {Math.max(allProjects.length - featured.length, 0)} more.{' '}
          <Link
            href='/projects'
            className='text-foreground underline decoration-[hsl(var(--ink-accent))] underline-offset-4 hover:no-underline'
          >
            ls ./projects &rarr;
          </Link>
        </p>
      </section>

      {/* --------------------------------------------------------- writing */}
      {posts.length > 0 && (
        <section id='writing' className='scroll-mt-12 py-20'>
          <SectionTitle index='02 writing'>Things I wrote</SectionTitle>
          <PostRows posts={posts} />
        </section>
      )}

      {/* ---------------------------------------------------------- say hi */}
      <section className='hairline pb-36 pt-24 text-center motion-reduce:pb-24'>
        <div className='flex justify-center'>
          <SectionTitle index='03 contact'>Say hi</SectionTitle>
        </div>
        <ul className='mt-8 flex flex-wrap justify-center gap-2'>
          {SOCIALS.map(s => (
            <li key={s.href}>
              <a href={s.href} target='_blank' rel='noreferrer noopener' className={pill}>
                {s.label} <span aria-hidden='true'>↗</span>
              </a>
            </li>
          ))}
          <li>
            <Link href='/contact' className={pill}>
              Email
            </Link>
          </li>
        </ul>
      </section>
    </HomeTrace>
  )
}
