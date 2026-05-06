import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { campaignSchema } from '@/lib/validations/campaign'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    const { data: rawCafe } = await db
      .from('cafes')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    const cafe = rawCafe as { id: string } | null

    if (!cafe) return NextResponse.json({ error: 'Kafe bulunamadı' }, { status: 404 })

    const { data: campaigns } = await db
      .from('campaigns')
      .select('*')
      .eq('cafe_id', cafe.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ campaigns })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    const { data: rawCafe } = await db
      .from('cafes')
      .select('id, plan')
      .eq('owner_id', user.id)
      .single()
    const cafe = rawCafe as { id: string; plan: string } | null

    if (!cafe) return NextResponse.json({ error: 'Kafe bulunamadı' }, { status: 404 })
    if (cafe.plan === 'starter') {
      return NextResponse.json(
        { error: 'Kampanya yönetimi Pro plana özeldir' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const parsed = campaignSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz veri" }, { status: 400 })
    }

    const { data: campaign, error } = await db
      .from('campaigns')
      .insert({ ...parsed.data, cafe_id: cafe.id })
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Kampanya oluşturulamadı' }, { status: 500 })

    return NextResponse.json({ campaign }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
