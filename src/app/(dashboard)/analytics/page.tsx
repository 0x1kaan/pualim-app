import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnalyticsClient } from './AnalyticsClient'
import type { Cafe } from '@/types/database'

export const metadata = { title: 'Analitik' }

export default async function AnalyticsPage() {
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

  const { data: rawCustomers } = await supabase
    .from('customers')
    .select('tag')
    .eq('cafe_id', cafe.id)
  const customers = (rawCustomers ?? []) as Array<{ tag: string }>

  const since = new Date(Date.now() - 7 * 86400000).toISOString()
  const { data: rawDailyStamps } = await supabase
    .from('stamps')
    .select('approved_at')
    .eq('cafe_id', cafe.id)
    .gte('approved_at', since)
  const dailyStamps = (rawDailyStamps ?? []) as Array<{ approved_at: string }>

  const stampsByDay: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toISOString().split('T')[0]
    stampsByDay[key] = 0
  }
  for (const s of dailyStamps) {
    const key = new Date(s.approved_at).toISOString().split('T')[0]
    if (key in stampsByDay) stampsByDay[key]++
  }
  const trend = Object.entries(stampsByDay).map(([date, count]) => ({ date, count }))

  const tagCounts: Record<string, number> = {
    vip: 0, loyal: 0, new: 0, at_risk: 0, lost: 0,
  }
  for (const c of customers) {
    if (c.tag in tagCounts) tagCounts[c.tag]++
  }

  return (
    <AnalyticsClient
      summary={summary}
      trend={trend}
      tagCounts={tagCounts}
    />
  )
}
