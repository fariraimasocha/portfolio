import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'
import Providers from '@/components/providers'
import Header from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: {
    default: 'fariraimasocha',
    template: '%s | fariraimasocha'
  },
  description: 'A portfolio showcasing some of my work',
  metadataBase: new URL('https://portfolio-78f0jlqla-farirais-projects.vercel.app/'),
  openGraph: {
    title: 'fariraimasocha',
    description: 'A portfolio showcasing some of my work',
    images: [
      {
        url: '/images/meta/preview.png',
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
    images: ['/images/meta/preview.png'],
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
        <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={cn(
          'flex min-h-screen flex-col font-sans antialiased',
          inter.variable,
          playfair.variable
        )}
      >
        <Providers>
          <Header />
          <main className='grow'>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
