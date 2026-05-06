import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })

    const url = new URL(req.url)
    const days = Math.min(parseInt(url.searchParams.get('days') ?? '30'), 90)

    const { data: rawCafe } = await supabase
      .from('cafes')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    const cafeData = rawCafe as { id: string } | null
    if (!cafeData) return NextResponse.json({ error: 'Kafe bulunamadı' }, { status: 404 })
    const cafeId = cafeData.id

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: summary } = await (supabase as any).rpc('get_cafe_analytics', {
      p_cafe_id: cafeId,
      p_days: days,
    })

    const since = new Date(Date.now() - 7 * 86400000).toISOString()
    const { data: rawStamps } = await supabase
      .from('stamps')
      .select('approved_at')
      .eq('cafe_id', cafeId)
      .gte('approved_at', since)
      .order('approved_at', { ascending: true })
    const dailyStamps = (rawStamps ?? []) as Array<{ approved_at: string }>

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

    return NextResponse.json({ summary, trend })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
