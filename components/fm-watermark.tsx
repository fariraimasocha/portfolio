'use client'

import { useEffect, useRef, useState } from 'react'
import opentype from 'opentype.js'

const FONT_URL = '/fonts/DMSerifDisplay.ttf'
const TEXT = 'FM'
const FONT_SIZE = 280
const DURATION = 1.6
const STAGGER = 0.4
const DELAY = 0.15

type Letter = { d: string }

export default function FMWatermark() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [letters, setLetters] = useState<Letter[]>([])
  const [viewBox, setViewBox] = useState('0 0 500 320')
  const [isAnimating, setIsAnimating] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const buf = await (await fetch(FONT_URL)).arrayBuffer()
        const font = opentype.parse(buf)
        if (cancelled) return

        const out: Letter[] = []
        let x = 0
        for (const ch of TEXT) {
          const glyph = font.charToGlyph(ch)
          const d = glyph.getPath(x, 0, FONT_SIZE).toPathData(2)
          if (d) out.push({ d })
          x += glyph.advanceWidth! * (FONT_SIZE / font.unitsPerEm)
        }

        const width = font.getAdvanceWidth(TEXT, FONT_SIZE)
        const ascender = (font.ascender / font.unitsPerEm) * FONT_SIZE
        const descender = (font.descender / font.unitsPerEm) * FONT_SIZE
        const pad = 20

        setLetters(out)
        setViewBox(
          `${-pad} ${-ascender - pad} ${width + pad * 2} ${ascender - descender + pad * 2}`
        )
        setIsAnimating(true)
      } catch (e) {
        console.error('FM watermark font load failed', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = svgRef.current
    if (!el || letters.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsAnimating(false)
            requestAnimationFrame(() => {
              void svgRef.current?.getBoundingClientRect()
              requestAnimationFrame(() => {
                setAnimKey((k) => k + 1)
                setIsAnimating(true)
              })
            })
          } else {
            setIsAnimating(false)
          }
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [letters.length])

  return (
    <div
      aria-hidden='true'
      className='fixed inset-0 overflow-hidden pointer-events-none select-none'
      style={{ zIndex: -1 }}
    >
      <div className='absolute top-1/2 -left-10 -translate-y-1/2 -rotate-90'>
        <svg
          ref={svgRef}
          key={animKey}
          width='500'
          height='320'
          viewBox={viewBox}
          preserveAspectRatio='xMidYMid meet'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          className={`fm-signature${isAnimating ? ' is-animating' : ''}`}
          style={
            {
              ['--fm-duration' as string]: `${DURATION}s`,
              ['--fm-stagger' as string]: `${STAGGER}s`,
              ['--fm-delay' as string]: `${DELAY}s`,
            } as React.CSSProperties
          }
        >
          {letters.map((letter, i) => (
            <path
              key={i}
              d={letter.d}
              fill='none'
              stroke='currentColor'
              strokeWidth={1.2}
              strokeLinecap='round'
              strokeLinejoin='round'
              pathLength='1'
              style={{
                animationDelay: `calc(var(--fm-delay) + ${i} * var(--fm-stagger))`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
