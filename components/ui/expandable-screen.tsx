'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface ExpandableScreenContextValue {
  isExpanded: boolean
  expand: () => void
  collapse: () => void
  layoutId: string
  triggerRadius: string
  contentRadius: string
  animationDuration: number
}

const ExpandableScreenContext = createContext<ExpandableScreenContextValue | null>(null)

function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext)
  if (!context) {
    throw new Error('useExpandableScreen must be used within an ExpandableScreen')
  }
  return context
}

interface ExpandableScreenProps {
  children: ReactNode
  defaultExpanded?: boolean
  onExpandChange?: (expanded: boolean) => void
  layoutId?: string
  triggerRadius?: string
  contentRadius?: string
  animationDuration?: number
  lockScroll?: boolean
}

export function ExpandableScreen({
  children,
  defaultExpanded = false,
  onExpandChange,
  layoutId = 'expandable-card',
  triggerRadius = '28px',
  contentRadius = '24px',
  animationDuration = 0.35,
  lockScroll = true
}: ExpandableScreenProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const expand = useCallback(() => {
    setIsExpanded(true)
    onExpandChange?.(true)
  }, [onExpandChange])

  const collapse = useCallback(() => {
    setIsExpanded(false)
    onExpandChange?.(false)
  }, [onExpandChange])

  // Escape to close — the cult-ui original only closes via the button.
  useEffect(() => {
    if (!isExpanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') collapse()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded, collapse])

  useEffect(() => {
    if (!lockScroll) return
    document.body.style.overflow = isExpanded ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isExpanded, lockScroll])

  return (
    <ExpandableScreenContext.Provider
      value={{
        isExpanded,
        expand,
        collapse,
        layoutId,
        triggerRadius,
        contentRadius,
        animationDuration
      }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  )
}

interface ExpandableScreenTriggerProps {
  children: ReactNode
  className?: string
}

export function ExpandableScreenTrigger({
  children,
  className = ''
}: ExpandableScreenTriggerProps) {
  const { isExpanded, expand, layoutId, triggerRadius } = useExpandableScreen()

  return (
    <AnimatePresence initial={false}>
      {!isExpanded && (
        <motion.div className={`relative block ${className}`}>
          {/* Background layer that morphs into the expanded surface */}
          <motion.div
            style={{ borderRadius: triggerRadius }}
            layout
            layoutId={layoutId}
            className='absolute inset-0 transform-gpu will-change-transform'
          />
          {/* Content layer fades out as the background takes over */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            exit={{ opacity: 0, scale: 0.98 }}
            layout={false}
            onClick={expand}
            role='button'
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                expand()
              }
            }}
            className='relative cursor-pointer rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ExpandableScreenContentProps {
  children: ReactNode
  className?: string
  showCloseButton?: boolean
  closeButtonClassName?: string
}

export function ExpandableScreenContent({
  children,
  className = '',
  showCloseButton = true,
  closeButtonClassName = ''
}: ExpandableScreenContentProps) {
  const { isExpanded, collapse, layoutId, contentRadius, animationDuration } =
    useExpandableScreen()

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <div
          role='dialog'
          aria-modal='true'
          className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4'
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={collapse}
            className='absolute inset-0 bg-background/60 backdrop-blur-sm'
          />
          <motion.div
            layoutId={layoutId}
            transition={{ duration: animationDuration }}
            style={{ borderRadius: contentRadius }}
            layout
            className={`relative flex h-full w-full overflow-y-auto transform-gpu will-change-transform ${className}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className='relative z-20 w-full'
            >
              {children}
            </motion.div>

            {showCloseButton && (
              <motion.button
                onClick={collapse}
                className={`absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  closeButtonClassName || 'bg-foreground/5 hover:bg-foreground/10'
                }`}
                aria-label='Close'
              >
                <X className='h-5 w-5' />
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export { useExpandableScreen }
