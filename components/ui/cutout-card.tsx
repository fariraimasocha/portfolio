'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type HTMLAttributes,
  type MouseEventHandler
} from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Surface tokens — the shadows themselves live in app/globals.css as
// --card-shadow / --card-shadow-hover, since they differ per theme.
// ---------------------------------------------------------------------------

export const cutoutCardSurfaceShadowClassName = cn(
  'border border-border/80',
  // shadow:… type hint — without it Tailwind reads a bare var() as a color.
  'shadow-[shadow:var(--card-shadow)]',
  'transition-[box-shadow,border-color] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
  'hover:border-border hover:shadow-[shadow:var(--card-shadow-hover)]'
)

export const cutoutCardSurfaceClassName = cn(
  'group/cutout relative cursor-pointer overflow-hidden rounded-[28px] bg-card text-card-foreground',
  cutoutCardSurfaceShadowClassName
)

/** Staggered entrance for text/footer inside `CutoutCardContent` — pair with `motion.div` children. */
export function useCutoutContentStaggerVariants() {
  const reduceMotion = useReducedMotion()

  return useMemo(() => {
    if (reduceMotion) {
      return {
        container: {
          hidden: {},
          show: { transition: { staggerChildren: 0.03, delayChildren: 0 } }
        },
        item: {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
          }
        }
      } as const
    }

    return {
      container: {
        hidden: {},
        show: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } }
      },
      item: {
        hidden: { opacity: 0, y: 12, filter: 'blur(5px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { type: 'spring', duration: 0.48, bounce: 0.14 }
        }
      }
    } as const
  }, [reduceMotion])
}

/** Inverse-radius corner: carves a notch so an inset label sits flush in negative space. */
const CORNER_PATH = 'M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface CutoutCardContextValue {
  hovered: boolean
  setHovered: (next: boolean) => void
}

const CutoutCardContext = createContext<CutoutCardContextValue | null>(null)

export function useCutoutCard() {
  const ctx = useContext(CutoutCardContext)
  if (!ctx) throw new Error('useCutoutCard must be used within <CutoutCard>')
  return ctx
}

export function useOptionalCutoutCard() {
  return useContext(CutoutCardContext)
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export type CutoutCardProps = Omit<ComponentProps<typeof motion.div>, 'defaultValue'> & {
  /** Controlled hover state. */
  hovered?: boolean
  defaultHovered?: boolean
  onHoveredChange?: (hovered: boolean) => void
  /** Set false to drive hover only programmatically. */
  trackPointerHover?: boolean
}

export function CutoutCard({
  className,
  hovered: hoveredProp,
  defaultHovered = false,
  onHoveredChange,
  trackPointerHover = true,
  onMouseEnter,
  onMouseLeave,
  children,
  ...props
}: CutoutCardProps) {
  const reduceMotion = useReducedMotion()
  // ponytail: plain useState instead of @radix-ui/react-use-controllable-state —
  // one extra dependency for six lines of merge logic isn't worth it.
  const [uncontrolled, setUncontrolled] = useState(defaultHovered)
  const isControlled = hoveredProp !== undefined
  const hovered = isControlled ? hoveredProp : uncontrolled

  const setHovered = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next)
      onHoveredChange?.(next)
    },
    [isControlled, onHoveredChange]
  )

  const ctx = useMemo<CutoutCardContextValue>(
    () => ({ hovered, setHovered }),
    [hovered, setHovered]
  )

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = e => {
    onMouseEnter?.(e)
    if (e.defaultPrevented || !trackPointerHover) return
    setHovered(true)
  }

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = e => {
    onMouseLeave?.(e)
    if (e.defaultPrevented || !trackPointerHover) return
    setHovered(false)
  }

  return (
    <CutoutCardContext.Provider value={ctx}>
      <motion.div
        animate={{ opacity: 1 }}
        className={cn(className)}
        data-slot='cutout-card'
        data-state={hovered ? 'hovered' : 'idle'}
        initial={{ opacity: 0 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        transition={{
          duration: reduceMotion ? 0.22 : 0.36,
          ease: [0.23, 1, 0.32, 1]
        }}
        {...props}
      >
        {children}
      </motion.div>
    </CutoutCardContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------

export function CutoutCardMedia({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      data-slot='cutout-card-media'
      {...props}
    />
  )
}

export type CutoutCardImageProps = ComponentProps<typeof Image>

/** Defaults to `fill`; the parent `CutoutCardMedia` must be relative with a set block size. */
export function CutoutCardImage({
  className,
  alt = '',
  fill = true,
  sizes = '(max-width: 768px) 100vw, 28rem',
  ...props
}: CutoutCardImageProps) {
  return (
    <Image
      alt={alt}
      className={cn(
        'object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover/cutout:scale-105',
        fill && 'h-full w-full',
        className
      )}
      data-slot='cutout-card-image'
      {...props}
      fill={fill}
      sizes={fill ? sizes : undefined}
    />
  )
}

export function CutoutCardOverlay({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent dark:from-background/50',
        className
      )}
      data-slot='cutout-card-overlay'
      {...props}
    />
  )
}

export function CutoutCardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} data-slot='cutout-card-content' {...props} />
}

export function CutoutCardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between', className)}
      data-slot='cutout-card-footer'
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// Cutout geometry
// ---------------------------------------------------------------------------

export type CutoutCornerProps = ComponentProps<'svg'> & { size?: number }

export function CutoutCorner({
  className,
  size = 32,
  viewBox = '0 0 200 200',
  ...props
}: CutoutCornerProps) {
  return (
    <svg
      aria-hidden
      className={cn(className)}
      data-slot='cutout-corner'
      height={size}
      viewBox={viewBox}
      width={size}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d={CORNER_PATH} fill='currentColor' />
    </svg>
  )
}

/** Absolutely positioned strip (e.g. bottom-left "FEATURED"); add corners as siblings inside. */
export function CutoutCardInsetLabel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('absolute', className)} data-slot='cutout-card-inset-label' {...props} />
  )
}

/** Corner badge shell (e.g. top-right year); add corners as siblings inside. */
export function CutoutCardPin({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('absolute', className)} data-slot='cutout-card-pin' {...props} />
}

// ---------------------------------------------------------------------------
// Context-sensitive action region
// ---------------------------------------------------------------------------

export type CutoutCardActionProps = ComponentProps<typeof motion.div> & {
  /** Set false to always show the region instead of revealing on hover. */
  revealOnHover?: boolean
}

export function CutoutCardAction({
  className,
  revealOnHover = true,
  ...props
}: CutoutCardActionProps) {
  const { hovered } = useCutoutCard()
  const reduceMotion = useReducedMotion()
  const visible = !revealOnHover || hovered

  return (
    <motion.div
      animate={
        visible
          ? { opacity: 1, transform: 'translateY(0px)' }
          : { opacity: 0, transform: 'translateY(8px)' }
      }
      className={cn('absolute', revealOnHover && !visible && 'pointer-events-none', className)}
      data-reveal={revealOnHover ? 'hover' : 'always'}
      data-slot='cutout-card-action'
      transition={{
        duration: reduceMotion ? 0.15 : 0.24,
        ease: [0.23, 1, 0.32, 1]
      }}
      {...props}
    />
  )
}
