'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

function parentOf(pathname: string): string {
  if (pathname === '/') return '/'
  if (pathname.startsWith('/projects/')) return '/projects'
  if (pathname.startsWith('/posts/')) return '/posts'
  return '/'
}

export default function BackButton() {
  const pathname = usePathname()
  if (pathname === '/') return null

  const href = parentOf(pathname)

  return (
    <Link
      href={href}
      className='fixed left-4 top-4 z-50 inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground sm:left-6 sm:top-6'
    >
      <ArrowLeft className='h-4 w-4' />
      back
    </Link>
  )
}
