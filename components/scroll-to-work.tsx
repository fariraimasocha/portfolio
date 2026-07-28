'use client'

import type { MouseEvent, ReactNode } from 'react'

import SquiggleArrow from '@/components/ui/squiggle-arrow'
import { cn } from '@/lib/utils'

/**
 * Hero scroll cue — text + squiggle are one control; smooth-scrolls to #work.
 */
export default function ScrollToWork({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById('work')
    if (!target) return

    e.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scrollYBefore = window.scrollY

    // #region agent log
    fetch('http://127.0.0.1:7811/ingest/ddd60f91-d12d-4c46-ba6a-bd19bf9bb0b5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '32a5ba'
      },
      body: JSON.stringify({
        sessionId: '32a5ba',
        runId: 'user-copy',
        hypothesisId: 'H1-scroll',
        location: 'scroll-to-work.tsx:click',
        message: 'scroll click',
        data: {
          scrollYBefore,
          reduced,
          workExists: true,
          label: e.currentTarget.textContent?.replace(/\s+/g, ' ').trim()
        },
        timestamp: Date.now()
      })
    }).catch(() => {})
    // #endregion

    target.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start'
    })
    history.pushState(null, '', '#work')

    window.setTimeout(() => {
      // #region agent log
      fetch('http://127.0.0.1:7811/ingest/ddd60f91-d12d-4c46-ba6a-bd19bf9bb0b5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '32a5ba'
        },
        body: JSON.stringify({
          sessionId: '32a5ba',
          runId: 'user-copy',
          hypothesisId: 'H1-scroll',
          location: 'scroll-to-work.tsx:after',
          message: 'after smooth scroll',
          data: {
            scrollYAfter: window.scrollY,
            workTop: target.getBoundingClientRect().top,
            hash: location.hash
          },
          timestamp: Date.now()
        })
      }).catch(() => {})
      // #endregion
    }, 500)
  }

  return (
    <a
      href='#work'
      onClick={handleClick}
      className={cn('inline-flex items-end gap-3', className)}
    >
      {children}
      <SquiggleArrow
        direction='down'
        variant='bouncy'
        width={64}
        height={44}
        className='pointer-events-none shrink-0 text-[hsl(var(--ink-accent))] opacity-60'
      />
    </a>
  )
}
