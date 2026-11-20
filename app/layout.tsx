import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'
import Providers from '@/components/providers'
import BackButton from '@/components/back-button'
import ThemeToggle from '@/components/theme-toggle'
import Cursor from '@/components/cursor'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: {
    default: 'farirai',
    template: '%s | farirai'
  },
  description: 'A portfolio showcasing some of my work',
  metadataBase: new URL('https://fariraimasocha.co.zw'),
  openGraph: {
    type: 'website',
    url: 'https://fariraimasocha.co.zw/',
    siteName: 'fariraimasocha',
    title: 'fariraimasocha',
    description: 'A portfolio showcasing some of my work',
    images: [
      {
        url: 'https://fariraimasocha.co.zw/og-image.jpg?v=2',
        width: 1200,
        height: 630,
        alt: 'fariraimasocha portfolio preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'fariraimasocha',
    description: 'A portfolio showcasing some of my work',
    images: ['https://fariraimasocha.co.zw/og-image.jpg?v=2'],
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </head>
      <body
        className={cn(
          'flex min-h-screen flex-col font-sans antialiased',
          spaceGrotesk.variable,
          jetbrainsMono.variable
        )}
      >
        <Providers>
          <div className='scroll-progress' aria-hidden='true' />
          <BackButton />
          <ThemeToggle />
          <Cursor />
          <main className='grow'>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
