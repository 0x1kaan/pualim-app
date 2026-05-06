import type { Metadata } from 'next'
import { LegalPage } from '../LegalPage'
import { lastUpdated, termsSections } from '../legal-content'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'Pualım kullanım koşulları.',
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Kullanım Koşulları"
      description="Pualım hizmetini kullanan kafe hesapları ve kullanıcılar için temel kullanım kuralları."
      lastUpdated={lastUpdated}
      sections={termsSections}
    />
  )
}
