import type { Metadata } from 'next'
import { LegalPage } from '../LegalPage'
import { kvkkSections, lastUpdated } from '../legal-content'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'Pualım KVKK aydınlatma metni taslağı.',
}

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Pualım hizmetindeki veri işleme faaliyetlerine ilişkin bilgilendirme."
      lastUpdated={lastUpdated}
      sections={kvkkSections}
    />
  )
}
