'use client'

import { useEffect, useState } from 'react'
import { Gift, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'

interface Reward {
  id: string
  status: string
  earned_at: string
  expires_at: string | null
  redeemed_at: string | null
}

export function RewardsList({ customerId, token, cafeId }: { customerId: string; token: string; cafeId: string }) {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/card/rewards?customerId=${customerId}&cafeId=${cafeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setRewards(d.rewards ?? []))
      .finally(() => setIsLoading(false))
  }, [customerId, token, cafeId])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
    )
  }

  if (rewards.length === 0) {
    return (
      <div className="text-center py-12">
        <Gift className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Henüz ödülünüz yok</p>
        <p className="text-sm text-muted-foreground/70">Puan biriktirmeye devam edin!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            reward.status === 'available'
              ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800'
              : 'border-border bg-muted/30 opacity-60'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            reward.status === 'available' ? 'bg-green-100' : 'bg-muted'
          }`}>
            {reward.status === 'redeemed' ? (
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Gift className="h-5 w-5 text-green-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">Ücretsiz Ödül</div>
            <div className="text-xs text-muted-foreground">
              {reward.status === 'redeemed'
                ? `Kullanıldı: ${formatDate(reward.redeemed_at)}`
                : reward.expires_at
                ? `Son: ${formatDate(reward.expires_at)}`
                : `Kazanıldı: ${formatDate(reward.earned_at)}`}
            </div>
          </div>
          <Badge
            variant={reward.status === 'available' ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {reward.status === 'available' ? 'Kullanılabilir' : reward.status === 'redeemed' ? 'Kullanıldı' : 'Süresi Doldu'}
          </Badge>
        </div>
      ))}
    </div>
  )
}
