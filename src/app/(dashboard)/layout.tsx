import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { isSupabaseConfigured } from '@/lib/demo'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseConfigured()) {
    return <DashboardShell demoMode>{children}</DashboardShell>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <DashboardShell>{children}</DashboardShell>
}

function DashboardShell({
  children,
  demoMode = false,
}: {
  children: React.ReactNode
  demoMode?: boolean
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Header />
        {demoMode && (
          <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-foreground">
            Demo modu aktif: Supabase ortam değişkenleri eklenene kadar panel örnek verilerle çalışır.
          </div>
        )}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
