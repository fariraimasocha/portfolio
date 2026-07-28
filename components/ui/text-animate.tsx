'use client'

import { type FC } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

import { cn } from '@/lib/utils'

export type TextAnimateType =
  | 'fadeIn'
  | 'fadeInUp'
  | 'popIn'
  | 'shiftInUp'
  | 'rollIn'
  | 'whipIn'
  | 'whipInUp'
  | 'calmInUp'

interface Props extends Omit<HTMLMotionProps<'div'>, 'children'> {
  text: string
  type?: TextAnimateType
  className?: string
}

const animationVariants = {
  fadeIn: {
    container: {
      hidden: { opacity: 0 },
      visible: (i: number = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: i * 0.3 }
      })
    },
    child: {
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, damping: 12, stiffness: 100 }
      },
      hidden: { opacity: 0, y: 10 }
    }
  },
  fadeInUp: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
      }
    },
    child: {
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      hidden: { opacity: 0, y: 20 }
    }
  },
  popIn: {
    container: {
      hidden: { scale: 0 },
      visible: {
        scale: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.2 }
      }
    },
    child: {
      visible: {
        opacity: 1,
        scale: 1.1,
        transition: { type: 'spring' as const, damping: 15, stiffness: 400 }
      },
      hidden: { opacity: 0, scale: 0 }
    }
  },
  calmInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i }
      })
    },
    child: {
      hidden: {
        y: '200%',
        transition: { ease: [0.455, 0.03, 0.515, 0.955] as const, duration: 0.85 }
      },
      visible: {
        y: 0,
        transition: { ease: [0.125, 0.92, 0.69, 0.975] as const, duration: 0.75 }
      }
    }
  },
  shiftInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i }
      })
    },
    child: {
      hidden: {
        y: '100%',
        transition: { ease: [0.75, 0, 0.25, 1] as const, duration: 0.6 }
      },
      visible: {
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
      }
    }
  },
  whipInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i }
      })
    },
    child: {
      hidden: {
        y: '200%',
        transition: { ease: [0.455, 0.03, 0.515, 0.955] as const, duration: 0.45 }
      },
      visible: {
        y: 0,
        transition: { ease: [0.5, -0.15, 0.25, 1.05] as const, duration: 0.75 }
      }
    }
  },
  rollIn: {
    container: { hidden: {}, visible: {} },
    child: {
      hidden: { opacity: 0, y: '0.25em' },
      visible: {
        opacity: 1,
        y: '0em',
        transition: { duration: 0.65, ease: [0.65, 0, 0.75, 1] as const }
      }
    }
  },
  whipIn: {
    container: { hidden: {}, visible: {} },
    child: {
      hidden: { opacity: 0, y: '0.35em' },
      visible: {
        opacity: 1,
        y: '0em',
        transition: { duration: 0.45, ease: [0.85, 0.1, 0.9, 1.2] as const }
      }
    }
  }
}

/**
 * Per-character entrance animation. `whipInUp` / `calmInUp` / `shiftInUp` mask
 * letters and slide them up from below; `rollIn` / `whipIn` fade per word.
 */
const TextAnimate: FC<Props> = ({ text, type = 'whipInUp', className, ...props }) => {
  const reduceMotion = useReducedMotion()
  const { container, child } = animationVariants[type]

  // Screen readers get the whole string once; the split spans are hidden from AT.
  if (reduceMotion) {
    return <div className={cn(className)}>{text}</div>
  }

  if (type === 'rollIn' || type === 'whipIn') {
    return (
      <div className={cn(className)}>
        {/* Real copy lives once here — animated letters are visual-only. */}
        <span className='sr-only'>{text}</span>
        <span aria-hidden='true' className='select-none'>
          {text.split(' ').map((word, wordIndex) => (
            <motion.span
              className='mr-[0.25em] inline-block whitespace-nowrap'
              key={wordIndex}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={container}
              transition={{ delayChildren: wordIndex * 0.13, staggerChildren: 0.025 }}
            >
              {word.split('').map((character, i) => (
                <motion.span key={i} variants={child} className='-mr-[0.01em] inline-block'>
                  {character}
                </motion.span>
              ))}
            </motion.span>
          ))}
        </span>
      </div>
    )
  }

  // Keep sr-only OUT of the flex row. Flex innerText inserts spaces between
  // letter spans ("I b u i l d…"), which made the headline copy unreadable.
  return (
    <div className={cn(className)}>
      <span className='sr-only'>{text}</span>
      <motion.div
        aria-hidden='true'
        style={{ display: 'flex', overflow: 'hidden' }}
        variants={container}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        className='select-none'
        {...props}
      >
        {Array.from(text).map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export { TextAnimate }
export default TextAnimate
