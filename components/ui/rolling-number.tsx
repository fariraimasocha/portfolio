'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface RollingNumberProps {
  value: number
  /** Pad to at least this many digits, e.g. 2 -> "09". */
  minDigits?: number
  className?: string
  /** Extra ms of delay per column, left to right. */
  stagger?: number
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * Split-flap / slot-machine digits. Each column is a 0-9 strip translated to
 * the target digit, so the number physically spins into place when scrolled to.
 */
export default function RollingNumber({
  value,
  minDigits = 1,
  className,
  stagger = 70
}: RollingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const [rolled, setRolled] = useState(false)

  useEffect(() => {
    if (inView) setRolled(true)
  }, [inView])

  const digits = String(Math.max(0, Math.trunc(value))).padStart(minDigits, '0').split('')

  if (reduceMotion) {
    return (
      <span ref={ref} className={cn('tabular-nums', className)}>
        {digits.join('')}
      </span>
    )
  }

  return (
    <span
      ref={ref}
      className={cn('inline-flex overflow-hidden tabular-nums leading-none', className)}
      role='text'
      aria-label={digits.join('')}
    >
      {digits.map((d, i) => (
        <span key={i} aria-hidden='true' className='relative inline-block overflow-hidden'>
          {/* Invisible spacer fixes the column width to the widest glyph */}
          <span className='invisible block'>0</span>
          <span
            className='absolute inset-x-0 top-0 flex flex-col transition-transform [transition-duration:900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] will-change-transform'
            style={{
              transform: `translateY(-${(rolled ? Number(d) : 0) * 10}%)`,
              transitionDelay: `${i * stagger}ms`
            }}
          >
            {DIGITS.map(n => (
              <span key={n} className='block'>
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

export { RollingNumber }
