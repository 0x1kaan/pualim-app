import type { Metadata } from 'next'
import { LegalPage } from '../LegalPage'
import { lastUpdated, privacySections } from '../legal-content'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Pualım gizlilik politikası ve kişisel veri işleme özeti.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      description="Pualım’da hangi bilgilerin toplandığını, bu bilgilerin hangi amaçlarla kullanıldığını ve haklarınızı özetler."
      lastUpdated={lastUpdated}
      sections={privacySections}
    />
  )
}
