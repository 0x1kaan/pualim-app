import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    let payload: { customerId: string; cafeId: string; phone: string }

    try {
      const { payload: p } = await jwtVerify(token, secret)
      payload = p as typeof payload
    } catch {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })
    }

    const { customerId, cafeId } = payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any

    // Son 5 dakikada bekleyen istek var mı?
    const { count } = await supabase
      .from('pending_stamps')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', customerId)
      .eq('cafe_id', cafeId)
      .eq('status', 'pending')
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: 'Zaten bekleyen bir puan talebiniz var' },
        { status: 409 }
      )
    }

    const { data: rawPending } = await supabase
      .from('pending_stamps')
      .insert({
        cafe_id: cafeId,
        customer_id: customerId,
        phone: payload.phone,
      })
      .select('id')
      .single()
    const pending = rawPending as { id: string } | null

    return NextResponse.json({ success: true, pendingId: pending?.id })
  } catch (error) {
    console.error('stamp request error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
