import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { createAdminClient } from '@/lib/supabase/admin'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  let customerId: string
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    customerId = payload.customerId as string
  } catch {
    return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const qCustomerId = searchParams.get('customerId')

  if (qCustomerId !== customerId) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any
  const { data: visits } = await supabase
    .from('stamps')
    .select('id, approved_at, multiplier')
    .eq('customer_id', customerId)
    .order('approved_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ visits: visits ?? [] })
}
