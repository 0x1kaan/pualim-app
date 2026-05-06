import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CustomersClient } from './CustomersClient'
import type { Cafe } from '@/types/database'

export const metadata = { title: 'Müşteriler' }

export default async function CustomersPage() {
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

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('cafe_id', cafe.id)
    .order('last_visit_at', { ascending: false, nullsFirst: false })

  return <CustomersClient cafe={cafe} customers={customers ?? []} />
}
