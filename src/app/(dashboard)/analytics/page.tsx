import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  demoCafe,
  demoAnalyticsTrend,
  demoSummary,
  demoTagCounts,
  isSupabaseConfigured,
} from '@/lib/demo'
import { AnalyticsClient } from './AnalyticsClient'
import type { Cafe } from '@/types/database'

export const metadata = { title: 'Analitik' }

const DAY_MS = 86_400_000
const TREND_DAYS = 7

function getTrendWindow() {
  const now = Date.now()
  const since = new Date(now - TREND_DAYS * DAY_MS).toISOString()
  const days = Array.from({ length: TREND_DAYS }, (_, index) => {
    const offset = TREND_DAYS - 1 - index
    return new Date(now - offset * DAY_MS).toISOString().split('T')[0]
  })

  return { since, days }
}

export default async function AnalyticsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <AnalyticsClient
        cafe={demoCafe}
        summary={demoSummary}
        trend={demoAnalyticsTrend}
        tagCounts={demoTagCounts}
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

  const { data: rawCustomers } = await supabase
    .from('customers')
    .select('tag')
    .eq('cafe_id', cafe.id)
  const customers = (rawCustomers ?? []) as Array<{ tag: string }>

  const { since, days } = getTrendWindow()
  const { data: rawDailyStamps } = await supabase
    .from('stamps')
    .select('approved_at')
    .eq('cafe_id', cafe.id)
    .gte('approved_at', since)
  const dailyStamps = (rawDailyStamps ?? []) as Array<{ approved_at: string }>

  const stampsByDay = Object.fromEntries(days.map((day) => [day, 0])) as Record<string, number>
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
      cafe={cafe}
      summary={summary}
      trend={trend}
      tagCounts={tagCounts}
    />
  )
}
