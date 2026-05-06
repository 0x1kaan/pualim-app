import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  notes: z.string().max(500).optional(),
  birthday: z.string().optional(),
  tag: z.enum(['vip', 'loyal', 'new', 'at_risk', 'lost']).optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: rawCafe } = await db
    .from('cafes')
    .select('id')
    .eq('owner_id', user.id)
    .single()
  const cafe = rawCafe as { id: string } | null

  if (!cafe) return NextResponse.json({ error: 'Kafe bulunamadı' }, { status: 404 })

  const { data: customer } = await db
    .from('customers')
    .select('*')
    .eq('id', id)
    .eq('cafe_id', cafe.id)
    .single()

  if (!customer) return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })

  const { data: stamps } = await db
    .from('stamps')
    .select('id, approved_at, multiplier')
    .eq('customer_id', id)
    .order('approved_at', { ascending: false })
    .limit(20)

  return NextResponse.json({ customer, stamps: stamps ?? [] })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await req.json()
  const result = patchSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: rawCafe } = await db
    .from('cafes')
    .select('id')
    .eq('owner_id', user.id)
    .single()
  const cafe = rawCafe as { id: string } | null

  if (!cafe) return NextResponse.json({ error: 'Kafe bulunamadı' }, { status: 404 })

  const { data: customer, error } = await db
    .from('customers')
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('cafe_id', cafe.id)
    .select()
    .single()

  if (error || !customer) {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 400 })
  }

  return NextResponse.json({ customer })
}
