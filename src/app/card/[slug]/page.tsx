import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { LoyaltyCardClient } from '@/components/card/LoyaltyCardClient'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any
  const { data: rawCafe } = await supabase
    .from('cafes')
    .select('name')
    .eq('slug', slug)
    .single()
  const cafe = rawCafe as { name: string } | null

  return {
    title: cafe ? `${cafe.name} — Sadakat Kartım` : 'Sadakat Kartı',
  }
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any

  const { data: rawCafe } = await supabase
    .from('cafes')
    .select('id, name, slug, logo_url, primary_color, stamps_required, reward_title, reward_description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  const cafe = rawCafe as {
    id: string
    name: string
    slug: string
    logo_url: string | null
    primary_color: string
    stamps_required: number
    reward_title: string
    reward_description: string | null
  } | null

  if (!cafe) notFound()

  return <LoyaltyCardClient cafe={cafe} />
}
