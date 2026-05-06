import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  demoCafe,
  demoCampaigns,
  isSupabaseConfigured,
} from '@/lib/demo'
import { CampaignsClient } from './CampaignsClient'
import type { Cafe } from '@/types/database'

export const metadata = { title: 'Kampanyalar' }

export default async function CampaignsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <CampaignsClient
        cafe={demoCafe}
        initialCampaigns={demoCampaigns}
        demoMode
      />
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: cafeData } = await supabase
    .from('cafes')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!cafeData) return redirect('/onboarding')
  const cafe = cafeData as Cafe

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('cafe_id', cafe.id)
    .order('created_at', { ascending: false })

  return <CampaignsClient cafe={cafe} initialCampaigns={campaigns ?? []} />
}
