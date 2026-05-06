import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
)

const schema = z.object({ rewardId: z.string().uuid() })

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  let customerId: string
  let cafeId: string
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    customerId = payload.customerId as string
    cafeId = payload.cafeId as string
  } catch {
    return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })
  }

  const body = await req.json()
  const result = schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any

  const { data: rawReward } = await supabase
    .from('rewards')
    .select('id, status, customer_id, cafe_id')
    .eq('id', result.data.rewardId)
    .single()
  const reward = rawReward as {
    id: string
    status: string
    customer_id: string
    cafe_id: string
  } | null

  if (!reward) return NextResponse.json({ error: 'Ödül bulunamadı' }, { status: 404 })
  if (reward.customer_id !== customerId || reward.cafe_id !== cafeId) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }
  if (reward.status !== 'available') {
    return NextResponse.json({ error: 'Bu ödül kullanılamaz' }, { status: 400 })
  }

  const { data: updated, error } = await supabase
    .from('rewards')
    .update({ status: 'redeemed', redeemed_at: new Date().toISOString() })
    .eq('id', result.data.rewardId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Kullanılamadı' }, { status: 500 })

  return NextResponse.json({ reward: updated })
}
