import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsClient } from './SettingsClient'
import type { Cafe } from '@/types/database'

export const metadata = { title: 'Ayarlar' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: cafeData } = await supabase
    .from('cafes')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!cafeData) return redirect('/onboarding')
  const cafe = cafeData as Cafe

  return <SettingsClient cafe={cafe} />
}
