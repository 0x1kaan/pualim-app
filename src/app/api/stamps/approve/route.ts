import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const approveSchema = z.object({
  pendingId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  note: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = approveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz veri" }, { status: 400 })
    }

    const { pendingId, action, note } = parsed.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any

    // Pending stamp'i getir ve kafe sahipliğini doğrula
    const { data: rawPending } = await admin
      .from('pending_stamps')
      .select('id, cafe_id, customer_id, phone, cafes:cafe_id(owner_id)')
      .eq('id', pendingId)
      .eq('status', 'pending')
      .single()
    const pending = rawPending as {
      id: string
      cafe_id: string
      customer_id: string | null
      phone: string
      cafes: { owner_id: string }
    } | null

    if (!pending) {
      return NextResponse.json({ error: 'Talep bulunamadı' }, { status: 404 })
    }

    if (pending.cafes.owner_id !== user.id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    if (action === 'reject') {
      await admin
        .from('pending_stamps')
        .update({ status: 'rejected' })
        .eq('id', pendingId)

      return NextResponse.json({ success: true, action: 'rejected' })
    }

    // Onaylama — aktif kampanya var mı?
    const now = new Date().toISOString()
    const currentHour = new Date().getHours()
    const currentDay = new Date().getDay()

    const { data: rawCampaign } = await admin
      .from('campaigns')
      .select('id, stamp_multiplier')
      .eq('cafe_id', pending.cafe_id)
      .eq('is_active', true)
      .lte('starts_at', now)
      .gte('ends_at', now)
      .contains('active_days', [currentDay])
      .lte('active_hours_start', currentHour)
      .gte('active_hours_end', currentHour)
      .limit(1)
      .single()
    const campaign = rawCampaign as { id: string; stamp_multiplier: number } | null

    const multiplier = campaign?.stamp_multiplier ?? 1

    // Stamp oluştur (trigger otomatik customer stats günceller)
    await admin.from('stamps').insert({
      customer_id: pending.customer_id!,
      cafe_id: pending.cafe_id,
      approved_by: user.id,
      campaign_id: campaign?.id ?? null,
      multiplier,
      note: note ?? null,
    })

    // Pending stamp'i güncelle
    await admin
      .from('pending_stamps')
      .update({ status: 'approved' })
      .eq('id', pendingId)

    return NextResponse.json({ success: true, action: 'approved', multiplier })
  } catch (error) {
    console.error('stamp approve error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
