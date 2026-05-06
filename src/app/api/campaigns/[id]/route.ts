import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const patchSchema = z.object({
  is_active: z.boolean().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
})

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

  const { data: campaign, error } = await db
    .from('campaigns')
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('cafe_id', cafe.id)
    .select()
    .single()

  if (error || !campaign) {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 400 })
  }

  return NextResponse.json({ campaign })
}

export async function DELETE(
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

  const { error } = await db
    .from('campaigns')
    .delete()
    .eq('id', id)
    .eq('cafe_id', cafe.id)

  if (error) return NextResponse.json({ error: 'Silinemedi' }, { status: 400 })

  return NextResponse.json({ success: true })
}
