'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/theme-toggle'

export default function Header() {
    const pathname = usePathname()
    if (pathname === '/') return null

    return (
        <header className='fixed inset-x-0 top-0 z-50 bg-background/75 py-6 backdrop-blur-sm'>
            <nav className='container flex max-w-3xl items-center justify-between'>
                <div>
                    <Link href='/' className='font-sans text-2xl font-bold'>
                        FM
                    </Link>
                </div>

                <ul className='flex items-center gap-2 text-sm font-light text-muted-foreground sm:gap-4'>
                    <li>
                        <Link
                            href='/posts'
                            className='inline-flex h-10 items-center rounded-md px-3 transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                        >
                            Posts
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/projects'
                            className='inline-flex h-10 items-center rounded-md px-3 transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                        >
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/contact'
                            className='inline-flex h-10 items-center rounded-md px-3 transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                        >
                            Contact
                        </Link>
                    </li>
                </ul>

                <div>
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}