import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Kafe var mı? Yoksa onboarding'e yönlendir
  const { data: cafe } = await supabase
    .from('cafes')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  if (!cafe && !pathname.includes('onboarding')) {
    redirect('/onboarding')
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Header />
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
