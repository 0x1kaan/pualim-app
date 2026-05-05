import type { Metadata } from 'next'
import { DM_Sans, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/Providers'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin-ext'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin-ext'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pualim.today'),
  title: {
    default: 'Pualım — Kafeler için Dijital Sadakat Kartı',
    template: '%s | Pualım',
  },
  description:
    '5 dakikada kurulan, uygulama indirmeden çalışan dijital sadakat kartı. Kafeler için QR, ödül, WhatsApp ve SMS bildirimleri.',
  keywords: [
    'kafe sadakat programı',
    'dijital sadakat kartı',
    'kafe için sadakat',
    'QR sadakat kartı',
    'müşteri sadakati',
  ],
  openGraph: {
    title: 'Pualım',
    description: 'Kafeler için dijital sadakat kartı.',
    url: 'https://pualim.today',
    siteName: 'Pualım',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pualım',
    description: 'Kafeler için dijital sadakat kartı.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${dmSans.variable} ${playfair.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
