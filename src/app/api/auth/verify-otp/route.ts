import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { createAdminClient } from '@/lib/supabase/admin'
import { otpVerifySchema } from '@/lib/validations/customer'
import { formatPhone } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = otpVerifySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Geçersiz veri" },
        { status: 400 }
      )
    }

    const { phone, cafe_id, code } = parsed.data
    const formattedPhone = formatPhone(phone)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any

    // Geçerli OTP'yi bul
    const { data: rawOtp } = await supabase
      .from('otps')
      .select('id, code')
      .eq('phone', formattedPhone)
      .eq('cafe_id', cafe_id)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    const otp = rawOtp as { id: string; code: string } | null

    if (!otp || otp.code !== code) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş kod' }, { status: 400 })
    }

    // OTP'yi kullanıldı olarak işaretle
    await supabase.from('otps').update({ used: true }).eq('id', otp.id)

    // Müşteri yoksa oluştur
    const { data: rawExisting } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', formattedPhone)
      .eq('cafe_id', cafe_id)
      .single()
    const existing = rawExisting as { id: string } | null

    let customerId = existing?.id

    if (!customerId) {
      const { data: rawNewCustomer } = await supabase
        .from('customers')
        .insert({
          phone: formattedPhone,
          cafe_id,
          sms_consent: true,
        })
        .select('id')
        .single()
      const newCustomer = rawNewCustomer as { id: string } | null
      customerId = newCustomer?.id
    }

    if (!customerId) {
      return NextResponse.json({ error: 'Müşteri oluşturulamadı' }, { status: 500 })
    }

    // JWT token üret (24 saat)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const token = await new SignJWT({ customerId, cafeId: cafe_id, phone: formattedPhone })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    return NextResponse.json({ success: true, token, customerId })
  } catch (error) {
    console.error('verify-otp error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
