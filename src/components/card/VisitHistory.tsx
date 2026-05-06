'use client'

import { useEffect, useState } from 'react'
import { Coffee } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelativeTime } from '@/lib/utils'

interface Visit {
  id: string
  approved_at: string
  multiplier: number
}

export function VisitHistory({ customerId, token }: { customerId: string; token: string }) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/card/history?customerId=${customerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setVisits(d.visits ?? []))
      .finally(() => setIsLoading(false))
  }, [customerId, token])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
      </div>
    )
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-12">
        <Coffee className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Henüz ziyaret geçmişi yok</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {visits.map((visit) => (
        <div key={visit.id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Coffee className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Ziyaret</div>
            <div className="text-xs text-muted-foreground">{formatRelativeTime(visit.approved_at)}</div>
          </div>
          <div className="text-sm font-semibold text-primary">
            +{visit.multiplier} puan
          </div>
        </div>
      ))}
    </div>
  )
}
