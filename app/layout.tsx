import type { Metadata } from 'next'
import { Outfit, DM_Serif_Display, JetBrains_Mono, Anton } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'
// Roll animation styles for <SlotText> (components/copy-email.tsx)
import 'slot-text/style.css'
import Providers from '@/components/providers'
import BackButton from '@/components/back-button'
import ThemeToggle from '@/components/theme-toggle'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })
const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif'
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})
// Condensed heavy display face — hero headline only. Anton ships a single weight.
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display'
})

export const metadata: Metadata = {
  title: {
    default: 'fariraimasocha',
    template: '%s | fariraimasocha'
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
        url: 'https://fariraimasocha.co.zw/og-image.jpg',
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
    images: ['https://fariraimasocha.co.zw/og-image.jpg'],
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
          outfit.variable,
          dmSerif.variable,
          jetbrainsMono.variable,
          anton.variable
        )}
      >
        <Providers>
<BackButton />
          <ThemeToggle />
          <main className='grow'>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
