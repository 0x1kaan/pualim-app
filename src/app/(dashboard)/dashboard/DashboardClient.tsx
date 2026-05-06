'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Coffee,
  Gift,
  TrendingUp,
  Check,
  X,
  Loader2,
  Bell,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useCafeStore } from '@/stores/cafeStore'
import { formatRelativeTime } from '@/lib/utils'
import type { AnalyticsSummary, DemoPendingStamp } from '@/lib/demo'
import type { Cafe, PendingStamp } from '@/types/database'

interface Props {
  cafe: Cafe
  initialSummary: AnalyticsSummary | null
  initialPending: DemoPendingStamp[]
  demoMode?: boolean
}

const STATS = (s: AnalyticsSummary) => [
  {
    title: 'Bugün puan',
    value: s.today_stamps,
    icon: Coffee,
    color: 'text-primary',
    bg: 'bg-primary/10',
    sub: `${s.today_customers} müşteri`,
  },
  {
    title: 'Toplam müşteri',
    value: s.total_customers,
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    sub: `+${s.new_customers} bu ay`,
  },
  {
    title: 'Verilen ödül',
    value: s.total_rewards,
    icon: Gift,
    color: 'text-accent',
    bg: 'bg-accent/10',
    sub: `${s.redeemed_rewards} kullanıldı`,
  },
  {
    title: 'VIP müşteri',
    value: s.vip_count,
    icon: TrendingUp,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    sub: 'Sadık segment',
  },
]

export function DashboardClient({
  cafe,
  initialSummary,
  initialPending,
  demoMode = false,
}: Props) {
  const setCafe = useCafeStore((s) => s.setCafe)
  const [pending, setPending] = useState<DemoPendingStamp[]>(initialPending)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const summary = initialSummary

  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const approvalText = useMemo(() => {
    if (!summary || summary.total_rewards === 0) return 'Yeni ödül bekleniyor'
    const rate = Math.round((summary.redeemed_rewards / summary.total_rewards) * 100)
    return `%${rate} ödül kullanım oranı`
  }, [summary])

  useEffect(() => {
    setCafe(cafe)
  }, [cafe, setCafe])

  useEffect(() => {
    if (demoMode || !hasSupabaseConfig) return

    const supabase = createClient()
    const channel = supabase
      .channel('pending-stamps')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pending_stamps',
          filter: `cafe_id=eq.${cafe.id}`,
        },
        async (payload) => {
          const newPending = payload.new as PendingStamp
          const { data: rawCustomer } = await supabase
            .from('customers')
            .select('name, phone')
            .eq('id', newPending.customer_id!)
            .single()
          const customer = rawCustomer as { name: string | null; phone: string } | null

          setPending((prev) => [
            { ...newPending, customers: customer },
            ...prev.filter((p) => p.status === 'pending'),
          ])

          toast.info('Yeni puan talebi', {
            description: customer?.name ?? customer?.phone ?? 'Müşteri',
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [cafe.id, demoMode, hasSupabaseConfig])

  async function handleAction(pendingId: string, action: 'approve' | 'reject') {
    setApprovingId(pendingId)

    if (demoMode) {
      setPending((prev) => prev.filter((p) => p.id !== pendingId))
      toast.success(action === 'approve' ? 'Demo puan onaylandı' : 'Demo talep reddedildi')
      setApprovingId(null)
      return
    }

    try {
      const res = await fetch('/api/stamps/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingId, action }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error)
        return
      }

      setPending((prev) => prev.filter((p) => p.id !== pendingId))
      toast.success(action === 'approve' ? 'Puan onaylandı' : 'Talep reddedildi')
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-heading font-bold">Operasyon paneli</h1>
            {demoMode && <Badge variant="outline">Demo veri</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">
            {cafe.name} için puan talepleri, müşteri hareketi ve ödül durumu.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="capitalize">{cafe.plan}</Badge>
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="h-3 w-3" />
            {approvalText}
          </Badge>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS(summary).map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/70">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Puan talepleri
            </CardTitle>
            {pending.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {pending.length} bekliyor
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {pending.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <Coffee className="h-8 w-8 mx-auto mb-2 opacity-30" />
              Bekleyen puan talebi yok
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 rounded-lg bg-muted/40 p-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Coffee className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {p.customers?.name ?? p.customers?.phone ?? p.phone}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(p.created_at)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleAction(p.id, 'reject')}
                      disabled={approvingId === p.id}
                      aria-label="Talebi reddet"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-8 w-8 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(p.id, 'approve')}
                      disabled={approvingId === p.id}
                      aria-label="Talebi onayla"
                    >
                      {approvingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
