'use client'

import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label'

// A crosshair ring that trails the pointer and swells over anything clickable,
// with a live x/y readout. Fine pointers only; off under reduced motion.
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const coords = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fine = matchMedia('(pointer: fine)').matches
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || still || !ring.current || !dot.current || !coords.current) return

    const r = ring.current
    const d = dot.current
    const c = coords.current
    let x = -100, y = -100, rx = x, ry = y, s = 1, target = 1, raf = 0

    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      target = (e.target as Element | null)?.closest?.(INTERACTIVE) ? 2.2 : 1
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`
      c.textContent = `${x},${y}`
      r.style.opacity = d.style.opacity = '1'
    }
    const hide = () => (r.style.opacity = d.style.opacity = '0')
    const tick = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      s += (target - s) * 0.2
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${s})`
      raf = requestAnimationFrame(tick)
    }

    document.documentElement.classList.add('has-cursor')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', hide)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={ring}
        aria-hidden='true'
        className='pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 size-8 rounded-full border border-[hsl(var(--ink-accent))] opacity-0 transition-opacity duration-300 will-change-transform'
      />
      <div
        ref={dot}
        aria-hidden='true'
        className='pointer-events-none fixed left-0 top-0 z-[100] opacity-0 transition-opacity duration-300 will-change-transform'
      >
        <span className='absolute -left-[3px] -top-[3px] size-1.5 rounded-full bg-[hsl(var(--ink-accent))]' />
        <span
          ref={coords}
          className='absolute left-5 top-4 whitespace-nowrap font-mono text-[10px] tabular-nums text-muted-foreground'
        />
      </div>
    </>
  )
}
