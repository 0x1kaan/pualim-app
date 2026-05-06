import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  demoCafe,
  demoPendingStamps,
  demoSummary,
  isSupabaseConfigured,
} from '@/lib/demo'
import { DashboardClient } from './DashboardClient'
import type { Cafe } from '@/types/database'

export const metadata = { title: 'Panel' }

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <DashboardClient
        cafe={demoCafe}
        initialSummary={demoSummary}
        initialPending={demoPendingStamps}
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: summary } = await (supabase as any).rpc('get_cafe_analytics', {
    p_cafe_id: cafe.id,
    p_days: 30,
  })

  const { data: pendingStamps } = await supabase
    .from('pending_stamps')
    .select('*, customers(name, phone)')
    .eq('cafe_id', cafe.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <DashboardClient
      cafe={cafe}
      initialSummary={summary}
      initialPending={pendingStamps ?? []}
    />
  )
}
