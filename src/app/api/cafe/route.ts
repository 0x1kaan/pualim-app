import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cafeCreateSchema, cafeUpdateSchema } from '@/lib/validations/cafe'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cafe } = await (supabase as any)
      .from('cafes')
      .select('*')
      .eq('owner_id', user.id)
      .single()

    return NextResponse.json({ cafe })
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

    // Zaten kafe var mı?
    const { data: existing } = await db
      .from('cafes')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Zaten bir kafeye sahipsiniz' }, { status: 409 })
    }

    const body = await req.json()
    const parsed = cafeCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz veri" }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any
    let slug = parsed.data.slug || slugify(parsed.data.name)

    // Slug benzersizliği
    const { count } = await admin
      .from('cafes')
      .select('id', { count: 'exact', head: true })
      .eq('slug', slug)

    if ((count ?? 0) > 0) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
    }

    const { data: cafe, error } = await admin
      .from('cafes')
      .insert({ ...parsed.data, slug, owner_id: user.id })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Kafe oluşturulamadı' }, { status: 500 })
    }

    return NextResponse.json({ cafe }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 })

    const body = await req.json()
    const parsed = cafeUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz veri" }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cafe, error } = await (supabase as any)
      .from('cafes')
      .update(parsed.data)
      .eq('owner_id', user.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 })

    return NextResponse.json({ cafe })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
