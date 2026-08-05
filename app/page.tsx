import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'

// Social glyphs via the icons0.dev registry (npx shadcn add @icons0/simple-icons/*)
import { SimpleIconsGithub } from '@/components/icons/simple-icons/github'
import { SimpleIconsLinkedin } from '@/components/icons/simple-icons/linkedin'
import { SimpleIconsX } from '@/components/icons/simple-icons/x'

import { getProjects } from '@/lib/projects'
import { getPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

import CopyEmail from '@/components/copy-email'
import HeroHeadline from '@/components/hero-headline'
import ProjectCard from '@/components/project-card'
import ProjectStrip from '@/components/project-strip'
import RollingNumber from '@/components/ui/rolling-number'
import TextAnimate from '@/components/ui/text-animate'
import ThinkingOrb from '@/components/ui/thinking-orb'

const FEATURED_SLUGS = [
  'a-linkgenie-website',
  'utashi',
  'c-fitmycv',
  'domainflex',
  'e-waitfast',
  'f-10x',
  'vercellense',
  'subit'
]

// Nav pills. `projects` folds away below sm so two pills clear a 320px viewport.
const PILLS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '/projects', label: 'Projects', smUp: true }
]

const SOCIALS = [
  { href: 'https://github.com/fariraimasocha', label: 'github', Icon: SimpleIconsGithub },
  { href: 'https://x.com/fariraimasocha', label: 'x', Icon: SimpleIconsX },
  {
    href: 'https://www.linkedin.com/in/fariraimasocha',
    label: 'linkedin',
    Icon: SimpleIconsLinkedin
  }
]

// Brand marks self-hosted from thesvg.org (public/icons/brands/*.svg).
// The Next.js mark is a black disc, so it needs inverting on the dark theme.
const STACK = [
  { src: '/icons/brands/typescript.svg', label: 'TypeScript' },
  { src: '/icons/brands/nextjs.svg', label: 'Next.js', invertOnDark: true },
  { src: '/icons/brands/react.svg', label: 'React' },
  { src: '/icons/brands/python.svg', label: 'Python' },
  { src: '/icons/brands/cloudflare.svg', label: 'Cloudflare' },
  { src: '/icons/brands/tailwindcss.svg', label: 'Tailwind' }
]

export default async function Home() {
  const [allProjects, allPosts] = await Promise.all([getProjects(), getPosts()])
  const posts = allPosts.slice(0, 5)

  const featured = FEATURED_SLUGS.map(slug =>
    allProjects.find(p => p.slug === slug)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p))

  const yearsBuilding = new Date().getFullYear() - 2023

  return (
    <>
      {/* ---------------------------------------------------------------- nav */}
      <header className='fixed inset-x-0 top-0 z-40'>
        {/* Dissolve, not a bar. The mask fades the backdrop-blur out along with
            the gradient, so there's no seam where the filter stops. */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/85 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_40%,transparent)]'
        />
        {/* Three zones at sm+: pills / wordmark / socials. Below sm it collapses
            to a flex row and `order-first` pulls the wordmark back to the left. */}
        <nav className='relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-10'>
          {/* pr-* only matters below sm, where the pills are the rightmost
              element and would sit under the fixed ThemeToggle */}
          <ul className='flex items-center gap-2 pr-10 sm:pr-0'>
            {PILLS.map(pill => (
              <li key={pill.href} className={pill.smUp ? 'hidden sm:block' : undefined}>
                <Link
                  href={pill.href}
                  className='inline-flex rounded-full bg-muted px-4 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground'
                >
                  {pill.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href='/'
            className='order-first font-mono text-sm lowercase tracking-tight text-foreground sm:order-none sm:justify-self-center'
          >
            farirai
          </Link>

          {/* pr-* keeps clear of the fixed ThemeToggle in app/layout.tsx */}
          <ul className='hidden items-center gap-2.5 pr-12 sm:flex sm:justify-self-end'>
            {[
              ...SOCIALS,
              { href: '/contact', label: 'email', Icon: Mail }
            ].map((social, i) => (
              <li key={social.href} className='flex items-center gap-2.5'>
                {i > 0 && (
                  <span className='text-border' aria-hidden='true'>
                    /
                  </span>
                )}
                <Link
                  href={social.href}
                  {...(social.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                  className='text-muted-foreground transition-colors duration-200 hover:text-foreground'
                >
                  <social.Icon className='size-4' aria-hidden='true' />
                  <span className='sr-only'>{social.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className='relative isolate overflow-hidden'>
        {/* Drafting hairlines — engineer's paper under the editorial layout */}
        {/* Masked at both ends so the hairlines fade in under the nav rather
            than starting on a hard line */}
        <div
          className='rule-grid pointer-events-none absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_88%,transparent)]'
          aria-hidden='true'
        />

        {/* Ambient light sits behind the centred type now, not beside it */}
        <div className='pointer-events-none absolute left-1/2 top-[22%] z-0 aspect-square w-[52vw] max-w-[420px] -translate-x-1/2 opacity-30 sm:w-[60vw] sm:opacity-40'>
          <ThinkingOrb />
        </div>

        <div className='relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-36 text-center sm:px-10 sm:pt-44'>
          <HeroHeadline />

          <p className='mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-base text-muted-foreground sm:text-lg'>
            <span>Software Engineer</span>
            <span aria-hidden='true'>·</span>
            <span>Harare, ZW</span>
            <span aria-hidden='true'>·</span>
            <span className='inline-flex items-center gap-2 text-foreground'>
              <span className='relative flex size-1.5'>
                <span className='absolute inline-flex size-full animate-ping rounded-full bg-[hsl(var(--ink-accent))] opacity-60' />
                <span className='relative inline-flex size-1.5 rounded-full bg-[hsl(var(--ink-accent))]' />
              </span>
              open to work
            </span>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ work strip */}
      <ProjectStrip projects={allProjects} />

      <div className='mx-auto max-w-6xl px-6 sm:px-10'>
        {/* --------------------------------------------------------- meta band */}
        <section className='grid gap-8 border-b border-border py-10 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <span className='label-mono'>currently</span>
            <p className='max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground'>
              Shipping AI tooling and developer utilities — small products that solve one
              problem properly.
            </p>
          </div>
          <div className='flex flex-col gap-3 sm:items-end'>
            <span className='label-mono'>stack</span>
            <ul className='flex flex-wrap items-center gap-3'>
              {STACK.map(tech => (
                <li key={tech.label} className='group/tech relative'>
                  <Image
                    src={tech.src}
                    alt={tech.label}
                    title={tech.label}
                    width={22}
                    height={22}
                    unoptimized
                    className={`size-[22px] opacity-60 grayscale transition duration-300 group-hover/tech:opacity-100 group-hover/tech:grayscale-0 ${
                      tech.invertOnDark ? 'dark:invert' : ''
                    }`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------------- stats */}
        <section className='grid grid-cols-3 gap-6 border-b border-border py-10 sm:py-14'>
          {[
            { value: allProjects.length, label: 'things shipped' },
            { value: allPosts.length, label: 'posts written' },
            { value: yearsBuilding, label: 'years building' }
          ].map(stat => (
            <div key={stat.label} className='flex flex-col gap-2'>
              <RollingNumber
                value={stat.value}
                minDigits={2}
                className='text-4xl font-medium tracking-tight sm:text-6xl'
              />
              <span className='label-mono'>{stat.label}</span>
            </div>
          ))}
        </section>

        {/* -------------------------------------------------------------- work */}
        <section id='work' className='scroll-mt-24 py-24 sm:py-32'>
          <div className='mb-10 flex items-end justify-between gap-6'>
            <span className='label-mono'>01 / selected work</span>
            <span className='label-mono hidden sm:block'>
              tap a card — there&rsquo;s more inside
            </span>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {featured.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>

          <Link
            href='/projects'
            className='group mt-10 inline-flex items-center gap-2 label-mono transition-colors hover:text-foreground'
          >
            see everything
            <ArrowUpRight
              className='size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
              aria-hidden='true'
            />
          </Link>
        </section>

        {/* --------------------------------------------------------------- bio */}
        <section
          id='about'
          className='relative scroll-mt-24 border-t border-border py-24 sm:py-32'
        >
          <span className='label-mono'>02 / about</span>
          <div className='mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16'>
            <p className='max-w-2xl text-pretty text-xl leading-relaxed text-muted-foreground sm:text-2xl sm:leading-relaxed'>
              I&rsquo;m <span className='text-foreground'>Farirai</span> — an engineer who
              likes the part where an idea stops being a document and starts being
              something you can click. I build{' '}
              <span className='text-foreground'>small, sharp products</span>: AI tooling,
              developer utilities, things that solve one problem properly. Most of them
              went from{' '}
              <span className='font-serif italic text-foreground'>
                &ldquo;what if&rdquo;
              </span>{' '}
              to production in weeks, not quarters.
            </p>
            <ThinkingOrb size={132} className='shrink-0 opacity-90' />
          </div>
        </section>

        {/* ----------------------------------------------------------- writing */}
        <section id='writing' className='scroll-mt-24 border-t border-border py-24 sm:py-32'>
          <span className='label-mono'>03 / writing</span>
          <ul className='mt-8 flex flex-col'>
            {posts.map(post => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className='group flex items-baseline justify-between gap-6 border-b border-border py-5 transition-colors hover:border-foreground/30'
                >
                  <span className='text-pretty text-lg text-muted-foreground transition-colors group-hover:text-foreground sm:text-xl'>
                    {post.title}
                  </span>
                  <span className='flex shrink-0 items-center gap-3'>
                    {post.publishedAt && (
                      <span className='label-mono hidden sm:block'>
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    <ArrowUpRight
                      className='size-4 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100'
                      aria-hidden='true'
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------------------------- cta */}
        <section className='relative border-t border-border py-28 sm:py-40'>
          <span className='label-mono'>04 / next</span>

          <h2 className='mt-8 max-w-4xl text-[clamp(2.25rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]'>
            <TextAnimate text='let’s build' type='shiftInUp' />
            <TextAnimate
              text='what’s next.'
              type='shiftInUp'
              className='text-muted-foreground'
            />
          </h2>

          <div className='mt-12 flex flex-wrap items-center gap-4'>
            {/* Pencil marginalia from the AIDesigner run
                (canvas "hand_drawn_arrow_annotation") — points at the buttons */}
            <Image
              src='/textures/pencil-arrow.png'
              alt=''
              aria-hidden='true'
              width={104}
              height={31}
              className='hidden opacity-60 dark:invert dark:opacity-40 lg:block'
            />
            <CopyEmail />
            <Link
              href='/contact'
              className='group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-150 active:scale-[0.97]'
            >
              start a conversation
              <ArrowUpRight
                className='size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                aria-hidden='true'
              />
            </Link>
          </div>

          <ul className='mt-14 flex flex-wrap gap-6'>
            {SOCIALS.map(social => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='label-mono inline-flex items-center gap-2 transition-colors duration-200 hover:text-foreground'
                >
                  <social.Icon className='size-3.5' aria-hidden='true' />
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
