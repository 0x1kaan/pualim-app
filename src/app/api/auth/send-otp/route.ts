import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendSMS, buildOTPMessage } from '@/lib/notifications/sms'
import { otpRequestSchema } from '@/lib/validations/customer'
import { generateOTP, formatPhone } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = otpRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Geçersiz veri" },
        { status: 400 }
      )
    }

    const { phone, cafe_id } = parsed.data
    const formattedPhone = formatPhone(phone)
    const supabase = createAdminClient()

    // Cafe varlığını kontrol et
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawCafe } = await (supabase as any)
      .from('cafes')
      .select('id, name, sms_enabled')
      .eq('id', cafe_id)
      .eq('is_active', true)
      .single()
    const cafe = rawCafe as { id: string; name: string; sms_enabled: boolean } | null

    if (!cafe) {
      return NextResponse.json({ error: 'Kafe bulunamadı' }, { status: 404 })
    }

    // Rate limit: son 1 dakikada 2'den fazla OTP gönderilmiş mi?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabase as any)
      .from('otps')
      .select('id', { count: 'exact', head: true })
      .eq('phone', formattedPhone)
      .eq('cafe_id', cafe_id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString())

    if ((count ?? 0) >= 2) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      )
    }

    const code = generateOTP()

    // OTP kaydet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('otps').insert({
      phone: formattedPhone,
      cafe_id,
      code,
    })

    // SMS gönder
    const smsResult = await sendSMS({
      to: formattedPhone,
      message: buildOTPMessage(code, cafe.name),
    })

    if (!smsResult.success) {
      console.error('SMS failed:', smsResult.error)
      // Geliştirme ortamında devam et, production'da hata dön
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'SMS gönderilemedi' }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      // Geliştirme ortamında kodu da dön
      ...(process.env.NODE_ENV !== 'production' && { debug_code: code }),
    })
  } catch (error) {
    console.error('send-otp error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
