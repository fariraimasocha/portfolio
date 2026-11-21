'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

export default function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    // The new theme grows out of the click point as a circle (View Transitions).
    // ponytail: browsers without startViewTransition just swap instantly.
    const toggle = (e: React.MouseEvent) => {
        const next = resolvedTheme === 'dark' ? 'light' : 'dark'
        const apply = () => {
            // Flip the class synchronously so the transition snapshots the new
            // theme; next-themes applies it in an effect, which is too late.
            document.documentElement.classList.toggle('dark', next === 'dark')
            document.documentElement.style.colorScheme = next
            setTheme(next)
        }

        if (
            !document.startViewTransition ||
            matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return apply()
        }

        const { clientX: x, clientY: y } = e
        const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
        document.startViewTransition(apply).ready.then(() => {
            document.documentElement.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
                {
                    duration: 700,
                    easing: 'cubic-bezier(0.7, 0, 0.3, 1)',
                    pseudoElement: '::view-transition-new(root)'
                }
            )
        })
    }

    return (
        <Button
            data-trace-theme-toggle
            size='sm'
            variant='ghost'
            onClick={toggle}
            className='fixed right-4 top-4 z-50 text-muted-foreground transition-colors hover:text-foreground sm:right-6 sm:top-6'
        >
            {resolvedTheme === 'dark' ? (
                <SunIcon className='size-4' />
            ) : (
                <MoonIcon className='size-4' />
            )}

            <span className='sr-only'>Toggle theme</span>
        </Button>
    )
}
