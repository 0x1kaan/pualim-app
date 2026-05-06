import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { createAdminClient } from '@/lib/supabase/admin'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  let customerId: string
  let cafeId: string
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    customerId = payload.customerId as string
    cafeId = payload.cafeId as string
  } catch {
    return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any

  const { data: rawCafe } = await supabase
    .from('cafes')
    .select('id')
    .eq('slug', slug)
    .single()
  const cafe = rawCafe as { id: string } | null

  if (!cafe || cafe.id !== cafeId) {
    return NextResponse.json({ error: 'Kafe bulunamadı' }, { status: 404 })
  }

  const { data: rawCustomer } = await supabase
    .from('customers')
    .select('id, name, current_stamps, total_stamps, visit_count, tag')
    .eq('id', customerId)
    .eq('cafe_id', cafeId)
    .single()
  const customer = rawCustomer as {
    id: string
    name: string | null
    current_stamps: number
    total_stamps: number
    visit_count: number
    tag: string
  } | null

  if (!customer) {
    return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({ customer })
}
