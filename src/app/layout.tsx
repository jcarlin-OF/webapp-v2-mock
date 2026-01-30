import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

// Using DM Sans as a fallback for Campton (similar geometric sans-serif)
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-campton',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'OnFrontiers | Expert Consultations',
    template: '%s | OnFrontiers',
  },
  description:
    'Connect with world-class experts for personalized consultations. Get strategic advice from industry leaders in technology, finance, marketing, and more.',
  keywords: [
    'expert consultations',
    'business advice',
    'professional consulting',
    'industry experts',
    'strategic consulting',
  ],
  authors: [{ name: 'OnFrontiers' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onfrontiers.com',
    siteName: 'OnFrontiers',
    title: 'OnFrontiers | Expert Consultations',
    description:
      'Connect with world-class experts for personalized consultations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OnFrontiers | Expert Consultations',
    description:
      'Connect with world-class experts for personalized consultations.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSans.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
