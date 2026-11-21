'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { portraitEnd, portraitStart, portraitStroke } from './developer-portrait'

export default function HomeTrace({ children }: { children: ReactNode }) {
  const page = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const tip = useRef<SVGPathElement>(null)
  const signatureDot = useRef<SVGCircleElement>(null)
  const signatureCursor = useRef<SVGPathElement>(null)

  useEffect(() => {
    const root = page.current
    const stroke = path.current
    const marker = tip.current
    const dot = signatureDot.current
    const cursor = signatureCursor.current
    const portrait = root?.querySelector<SVGSVGElement>('[data-trace-portrait]')
    const eyes = portrait?.querySelector('[data-portrait-eyes]')
    const work = root?.querySelector<HTMLElement>('#work')
    const writing = root?.querySelector<HTMLElement>('#writing')
    const fitMyCv = work?.querySelector<HTMLElement>(
      '[data-project-slug="c-fitmycv"] [data-project-title]'
    )
    if (!root || !stroke || !marker || !portrait || !work) return

    const measure = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let stops: { scroll: number; distance: number }[] = []
    let length = 0
    let frame = 0
    let portraitDistance = 0
    let portraitDrawn = false
    let blink: Animation | undefined

    function draw() {
      frame = 0
      if (!stroke || !marker || !length || reducedMotion.matches) return

      const scroll = window.scrollY
      const next = stops.findIndex(stop => stop.scroll >= scroll)
      const from = stops[Math.max(0, next - 1)]
      const to = stops[next]
      const fraction = next > 0 ? (scroll - from.scroll) / (to.scroll - from.scroll) : 0
      const distance = next < 0 ? length : from.distance + (to.distance - from.distance) * fraction
      const point = stroke.getPointAtLength(distance)
      const behind = stroke.getPointAtLength(Math.max(0, distance - 3))
      const angle = Math.atan2(point.y - behind.y, point.x - behind.x) * 180 / Math.PI
      const finished = distance >= length - 1

      stroke.style.strokeDashoffset = String(length - distance)
      stroke.style.opacity = distance > 0 ? '1' : '0'
      marker.style.opacity = distance > 0 && !finished ? '1' : '0'
      marker.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`)
      if (dot) dot.style.opacity = finished ? '1' : '0'
      cursor?.toggleAttribute('data-trace-finished', finished)

      const portraitComplete = distance >= portraitDistance
      if (portraitComplete && !portraitDrawn && eyes) {
        const eyePosition = eyes.getBoundingClientRect().top
        if (eyePosition > 0 && eyePosition < window.innerHeight) {
          blink?.cancel()
          blink = eyes.animate(
            [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.08)' }, { transform: 'scaleY(1)' }],
            { duration: 240, easing: 'ease-in-out' }
          )
        }
      }
      portraitDrawn = portraitComplete
    }

    function layout() {
      if (!root || !stroke || !portrait || !work || reducedMotion.matches) return
      const bounds = root.getBoundingClientRect()
      const artwork = portrait.getBoundingClientRect()
      const toggle = document.querySelector('[data-trace-theme-toggle]')?.getBoundingClientRect()
      const viewportWidth = document.documentElement.clientWidth
      const toggleInset = window.innerWidth >= 640 ? 24 : 16
      const originX = (toggle ? toggle.left + toggle.width / 2 : viewportWidth - toggleInset - 20) - bounds.left
      const originY = (toggle?.bottom ?? toggleInset + 32) - (bounds.top + window.scrollY)
      const portraitLeft = artwork.left - bounds.left
      const portraitTop = artwork.top - bounds.top
      const workTop = work.getBoundingClientRect().top - bounds.top
      const writingTop = writing ? writing.getBoundingClientRect().top - bounds.top : null
      const right = bounds.width - 9
      const left = 9
      const portraitX = portraitLeft + portraitStart.x
      const portraitY = portraitTop + portraitStart.y
      const exitX = portraitLeft + portraitEnd.x
      const exitY = portraitTop + portraitEnd.y
      const endY = bounds.height - 62
      const signatureX = bounds.width / 2 - 46
      const view = document.documentElement.clientHeight
      const maxScroll = document.documentElement.scrollHeight - view
      const lead = view * 0.67 - (bounds.top + window.scrollY)

      let x = originX
      let y = originY
      let commands = `M ${x} ${y}`
      length = 0
      stops = [{ scroll: 0, distance: 0 }]

      function segment(instructions: string, endX: number, endY: number, scroll: number) {
        measure.setAttribute('d', `M ${x} ${y} ${instructions}`)
        length += measure.getTotalLength()
        commands += ` ${instructions}`
        x = endX
        y = endY
        stops.push({ scroll: Math.max(scroll, stops[stops.length - 1].scroll + 1), distance: length })
      }

      const outer = Math.min(viewportWidth - bounds.left - 7, Math.max(originX + 32, right))
      const entryScroll = Math.max(48, portraitY - lead)
      const portraitScroll = Math.max(entryScroll + 145, exitY - lead + 30)
      segment(
        `C ${originX} ${originY + 26} ${outer} ${originY + 28} ${outer} ${originY + 65}
         V ${portraitY - 44} Q ${outer} ${portraitY + 24} ${portraitX} ${portraitY}`,
        portraitX, portraitY, entryScroll
      )
      segment(portraitStroke(portraitLeft, portraitTop), exitX, exitY, portraitScroll)
      portraitDistance = length

      const bend = Math.min(right, exitX + 65)
      segment(
        `C ${bend} ${exitY + 54} ${bend} ${workTop + 24} ${bounds.width * 0.65} ${workTop + 19}
         S ${left} ${workTop + 7} ${left} ${workTop + 57}`,
        left, workTop + 57, Math.max(portraitScroll + 76, workTop + 57 - lead)
      )

      if (fitMyCv) {
        const title = fitMyCv.getBoundingClientRect()
        const projectLink = fitMyCv.closest('a')
        const transform = projectLink ? getComputedStyle(projectLink).transform : 'none'
        // The row rises into view. Measure its resting position for the loop.
        const rise = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42
        const top = title.top - bounds.top - rise - 4
        const bottom = title.bottom - bounds.top - rise + 4
        const middle = (top + bottom) / 2
        const loopLeft = title.left - bounds.left - 8
        const loopRight = title.right - bounds.left + 8
        const radius = Math.min(15, (bottom - top) / 4)

        segment(`V ${middle - 24}`, left, middle - 24, top - lead)
        segment(
          `C ${left} ${middle - 8} ${loopLeft} ${middle - 12} ${loopLeft} ${middle}
           V ${top + radius} Q ${loopLeft} ${top} ${loopLeft + radius} ${top}
           H ${loopRight - radius} Q ${loopRight} ${top} ${loopRight} ${top + radius}
           V ${bottom - radius} Q ${loopRight} ${bottom} ${loopRight - radius} ${bottom}
           H ${loopLeft + radius} Q ${loopLeft} ${bottom} ${loopLeft} ${bottom - radius}
           V ${middle}`,
          loopLeft, middle, bottom - lead + 40
        )
        segment(
          `C ${loopLeft} ${middle + 14} ${left} ${middle + 12} ${left} ${middle + 30}`,
          left, middle + 30, bottom - lead + 56
        )
      }

      if (writingTop !== null) {
        const codeX = bounds.width / 2
        const codeY = writingTop - 8
        segment(`V ${codeY - 40}`, left, codeY - 40, codeY - 70 - lead)
        segment(
          `C ${left + 20} ${codeY - 18} ${codeX - 58} ${codeY - 52} ${codeX - 29} ${codeY - 22}`,
          codeX - 29, codeY - 22, codeY - 30 - lead
        )
        segment(
          `l -27 20 27 20 q 8 6 17 8 l 23 -52 q 10 -4 18 4 l 27 20 -27 20`,
          codeX + 29, codeY + 18, codeY + 66 - lead
        )
        segment(
          `C ${codeX + 36} ${codeY + 54} ${right} ${codeY + 7} ${right} ${codeY + 50}`,
          right, codeY + 50, codeY + 118 - lead
        )
      }

      segment(`V ${endY - 38}`, x, endY - 38, maxScroll - Math.min(140, view * 0.17))
      segment(
        `C ${x} ${endY - 5} ${signatureX - 23} ${endY + 12} ${signatureX} ${endY}
         c 16 -9 36 -43 26 -45 c -9 -3 -16 27 -20 45
         c 6 -13 15 -22 20 -17 c 4 4 -10 24 1 22
         c 8 -2 15 -13 19 -23 c -6 15 -10 25 -1 23 c 7 -1 13 -8 20 -13`,
        signatureX + 65, endY - 8, maxScroll
      )

      dot?.setAttribute('cx', String(signatureX + 48))
      dot?.setAttribute('cy', String(endY - 28))
      cursor?.setAttribute('transform', `translate(${signatureX + 74} ${endY + 1})`)
      stroke.setAttribute('d', commands)
      stroke.style.strokeDasharray = `${length} ${length}`
      draw()
    }

    function onScroll() {
      if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(draw)
    }

    const resize = new ResizeObserver(layout)
    resize.observe(root)
    resize.observe(portrait)
    resize.observe(work)
    if (fitMyCv) resize.observe(fitMyCv)
    if (writing) resize.observe(writing)
    window.addEventListener('resize', layout)
    window.addEventListener('scroll', onScroll, { passive: true })
    function updateMotionPreference() {
      blink?.cancel()
      layout()
    }

    reducedMotion.addEventListener('change', updateMotionPreference)
    layout()

    return () => {
      resize.disconnect()
      window.removeEventListener('resize', layout)
      window.removeEventListener('scroll', onScroll)
      reducedMotion.removeEventListener('change', updateMotionPreference)
      blink?.cancel()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={page} className='relative mx-auto max-w-5xl px-[clamp(1.25rem,4vw,3rem)] text-lg leading-normal'>
      <svg
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 h-full w-full overflow-visible text-[hsl(var(--ink-accent))] motion-reduce:hidden'
        fill='none'
      >
        <path ref={path} stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' opacity={0} />
        <path ref={tip} d='M 0 0 -9 -3.5 -13 -2.5 -13 2.5 -9 3.5 Z M -7.5 0 a 1 1 0 1 0 -2 0 a 1 1 0 1 0 2 0' fill='currentColor' fillRule='evenodd' opacity={0} />
        <circle ref={signatureDot} r={1.6} fill='currentColor' opacity={0} />
        <path ref={signatureCursor} className='trace-signature-cursor' d='M 0 0 h 12' stroke='currentColor' strokeWidth={2} />
      </svg>
      {children}
    </div>
  )
}
