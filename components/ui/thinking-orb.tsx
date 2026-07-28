import { cn } from '@/lib/utils'

interface ThinkingOrbProps {
  /** Fixed size in px. Omit to fill the parent, so the caller can size it responsively. */
  size?: number
  className?: string
}

/**
 * A luminous, slowly-breathing sphere built from layered radial/conic gradients.
 * Pure CSS — no canvas, no WebGL, no images. Keyframes live in globals.css
 * (`orb-*`) and freeze under prefers-reduced-motion.
 */
export default function ThinkingOrb({ size, className }: ThinkingOrbProps) {
  return (
    <div
      aria-hidden='true'
      className={cn(
        'pointer-events-none relative isolate',
        size === undefined && 'h-full w-full',
        className
      )}
      style={size === undefined ? undefined : { width: size, height: size }}
    >
      {/* Ambient bloom bleeding well past the sphere edge */}
      <div className='orb-bloom absolute -inset-[45%] rounded-full blur-[60px]' />

      {/* Sphere body — clipped stack of drifting gradient fields */}
      <div className='orb-body absolute inset-0 overflow-hidden rounded-full'>
        <div className='orb-drift-a absolute -inset-1/4 blur-xl' />
        <div className='orb-drift-b absolute -inset-1/4 blur-2xl mix-blend-screen' />
        <div className='orb-core absolute inset-0' />
      </div>

      {/* Volume: inner shadow at the base, hairline catch at the top */}
      <div className='orb-rim absolute inset-0 rounded-full' />
    </div>
  )
}

export { ThinkingOrb }
