import Image from 'next/image'
import Link from 'next/link'

import { cutoutCardSurfaceShadowClassName } from '@/components/ui/cutout-card'
import type { ProjectMetadata } from '@/lib/projects'
import { cn } from '@/lib/utils'

const VISIBLE = 8

/**
 * Full-bleed drifting strip of project screenshots, sitting directly under the
 * hero. Hovering pauses the drift (see `.marquee-track:hover` in globals.css)
 * so a tile can be clicked through to its case study.
 *
 * Both halves render the same 8 URLs — that's what `@keyframes marquee`
 * (translateX -50%) needs to loop seamlessly, and it costs 8 requests, not 16,
 * since the duplicates hit cache. The second half is hidden from assistive tech
 * and pulled out of the tab order so the same 8 links aren't announced twice.
 */
export default function ProjectStrip({ projects }: { projects: ProjectMetadata[] }) {
  const tiles = projects.filter(p => p.image).slice(0, VISIBLE)

  return (
    <div className='relative flex overflow-hidden border-y border-border py-6'>
      <div className='marquee-track flex shrink-0 items-center gap-5 pr-5'>
        {[...tiles, ...tiles].map((project, i) => {
          const isDuplicate = i >= tiles.length

          return (
            <Link
              key={`${isDuplicate ? 'dup' : 'src'}-${project.slug}`}
              href={`/projects/${project.slug}`}
              aria-hidden={isDuplicate || undefined}
              tabIndex={isDuplicate ? -1 : undefined}
              className={cn(
                'group/tile relative aspect-video w-[17rem] shrink-0 overflow-hidden rounded-[20px] bg-muted sm:w-[22rem]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                cutoutCardSurfaceShadowClassName
              )}
            >
              <Image
                src={project.image!}
                alt={isDuplicate ? '' : (project.title ?? '')}
                fill
                sizes='(max-width: 640px) 17rem, 22rem'
                className='object-cover transition-transform duration-500 group-hover/tile:scale-[1.03]'
              />
              <span className='pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-background/90 to-transparent px-4 pb-3 pt-8 opacity-0 transition-[opacity,transform] duration-300 group-hover/tile:translate-y-0 group-hover/tile:opacity-100'>
                <span className='label-mono text-foreground'>{project.title}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
