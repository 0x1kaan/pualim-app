import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })

    const url = new URL(req.url)
    const tag = url.searchParams.get('tag')
    const search = url.searchParams.get('search')
    const sort = url.searchParams.get('sort') ?? 'created_at'
    const order = url.searchParams.get('order') === 'asc'
    const page = parseInt(url.searchParams.get('page') ?? '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    const { data: rawCafe } = await db
      .from('cafes')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    const cafe = rawCafe as { id: string } | null

    if (!cafe) return NextResponse.json({ error: 'Kafe bulunamadı' }, { status: 404 })

    let query = db
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('cafe_id', cafe.id)

    if (tag) query = query.eq('tag', tag)
    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    const validSorts = ['created_at', 'last_visit_at', 'total_stamps', 'visit_count', 'name']
    const safeSort = validSorts.includes(sort) ? sort : 'created_at'
    query = query.order(safeSort, { ascending: order })
    query = query.range((page - 1) * limit, page * limit - 1)

    const { data: customers, count, error } = await query

    if (error) return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 })

    return NextResponse.json({
      customers,
      meta: { total: count ?? 0, page, limit },
    })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
