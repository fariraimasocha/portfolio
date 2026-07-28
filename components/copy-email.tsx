'use client'

import { useEffect, useRef, useState } from 'react'
import { SlotText } from 'slot-text/react'

import { cn } from '@/lib/utils'

const EMAIL = 'fariraimasocha@gmail.com'
const IDLE = 'copy email'

/**
 * Copy-to-clipboard button whose label rolls character-by-character between
 * states (slot-text). Falls back to a plain label swap if the roll can't run.
 */
export default function CopyEmail({ className }: { className?: string }) {
  const [label, setLabel] = useState(IDLE)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setLabel('copied')
    } catch {
      // Clipboard blocked (insecure context / permissions) — surface the address
      // so the visitor can still select it manually.
      setLabel(EMAIL)
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setLabel(IDLE), 2000)
  }

  return (
    <button
      type='button'
      onClick={copy}
      className={cn(
        'group inline-flex items-center gap-3 rounded-full border border-border px-5 py-2.5',
        'font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground',
        'transition-colors duration-200 hover:border-foreground/30 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      <span className='size-1.5 rounded-full bg-foreground/30 transition-colors group-hover:bg-foreground/70' />
      <SlotText text={label} />
    </button>
  )
}
