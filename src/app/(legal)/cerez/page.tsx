import type { Metadata } from 'next'
import { LegalPage } from '../LegalPage'
import { cookieSections, lastUpdated } from '../legal-content'

export const metadata: Metadata = {
  title: 'Çerez Politikası',
  description: 'Pualım çerez politikası.',
}

export default function CookiesPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      description="Pualım’ın çerezleri ve benzer yerel depolama teknolojilerini nasıl kullandığını açıklar."
      lastUpdated={lastUpdated}
      sections={cookieSections}
    />
  )
}
