'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
  cutoutCardSurfaceClassName,
  useCutoutContentStaggerVariants
} from '@/components/ui/cutout-card'
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger
} from '@/components/ui/expandable-screen'
import RollingNumber from '@/components/ui/rolling-number'
import type { ProjectMetadata } from '@/lib/projects'

interface ProjectCardProps {
  project: ProjectMetadata
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const stagger = useCutoutContentStaggerVariants()
  const year = project.publishedAt ? new Date(project.publishedAt).getFullYear() : null

  return (
    <ExpandableScreen layoutId={`project-${project.slug}`}>
      <ExpandableScreenTrigger className='w-full'>
        <CutoutCard className={cutoutCardSurfaceClassName}>
          <CutoutCardMedia className='h-56 bg-muted'>
            {project.image && (
              <CutoutCardImage
                alt={project.title ?? ''}
                sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
                src={project.image}
              />
            )}
            <CutoutCardOverlay />

            {/* Index strip carved into the bottom-left corner of the media */}
            <CutoutCardInsetLabel className='bottom-0 left-0 rounded-tr-[20px] bg-card px-4 py-2.5'>
              <span className='label-mono flex items-center gap-1 text-foreground/70'>
                <RollingNumber value={index + 1} minDigits={2} />
              </span>
              <CutoutCorner className='absolute -bottom-px -right-[31px] rotate-90 text-card' />
              <CutoutCorner className='absolute -left-px -top-[31px] rotate-90 text-card' />
            </CutoutCardInsetLabel>

            {year && (
              <CutoutCardPin className='right-0 top-0 rounded-bl-[16px] bg-card px-3.5 py-2'>
                <span className='label-mono text-foreground/70'>{year}</span>
                <CutoutCorner
                  className='absolute -left-[23px] top-0 -rotate-90 text-card'
                  size={24}
                />
                <CutoutCorner
                  className='absolute -bottom-[23px] right-0 -rotate-90 text-card'
                  size={24}
                />
              </CutoutCardPin>
            )}
          </CutoutCardMedia>

          <CutoutCardContent className='p-5 pb-14'>
            <motion.div
              animate='show'
              className='contents'
              initial='hidden'
              variants={stagger.container}
            >
              <motion.h3
                className='mb-1.5 text-balance text-lg font-medium leading-snug tracking-tight'
                variants={stagger.item}
              >
                {project.title}
              </motion.h3>
              <motion.p
                className='line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground'
                variants={stagger.item}
              >
                {project.summary}
              </motion.p>
            </motion.div>
          </CutoutCardContent>

          <CutoutCardAction className='bottom-4 right-4'>
            <span className='label-mono flex items-center gap-1.5 text-foreground'>
              open
              <ArrowUpRight className='size-3' aria-hidden='true' />
            </span>
          </CutoutCardAction>
        </CutoutCard>
      </ExpandableScreenTrigger>

      <ExpandableScreenContent className='mx-auto max-w-4xl bg-card shadow-2xl'>
        <div className='flex flex-col'>
          <div className='relative h-64 w-full shrink-0 overflow-hidden sm:h-80'>
            {project.image && (
              <Image
                alt={project.title ?? ''}
                src={project.image}
                fill
                sizes='(max-width: 896px) 100vw, 896px'
                className='object-cover'
              />
            )}
          </div>

          <div className='flex flex-col gap-6 p-8 sm:p-12'>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
              <span className='label-mono'>
                {String(index + 1).padStart(2, '0')} / project
              </span>
              {year && <span className='label-mono'>{year}</span>}
            </div>

            <h2 className='text-balance text-3xl font-medium tracking-tight sm:text-4xl'>
              {project.title}
            </h2>

            <p className='max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg'>
              {project.summary}
            </p>

            <Link
              href={`/projects/${project.slug}`}
              className='group inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-150 active:scale-[0.97]'
            >
              read the full case study
              <ArrowUpRight
                className='size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                aria-hidden='true'
              />
            </Link>
          </div>
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  )
}
