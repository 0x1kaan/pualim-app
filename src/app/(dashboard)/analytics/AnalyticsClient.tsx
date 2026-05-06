'use client'

import { useEffect, useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  Coffee,
  Gift,
  TrendingUp,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TAG_COLORS, TAG_LABELS, cn } from '@/lib/utils'
import { useCafeStore } from '@/stores/cafeStore'
import type { Cafe } from '@/types/database'

interface Summary {
  total_customers: number
  new_customers: number
  total_stamps: number
  today_stamps: number
  today_customers: number
  vip_count: number
  total_rewards: number
  redeemed_rewards: number
}

interface Props {
  cafe: Cafe
  summary: Summary | null
  trend: { date: string; count: number }[]
  tagCounts: Record<string, number>
  demoMode?: boolean
}

interface TrendPoint {
  date: string
  count: number
  label: string
}

const TrendChart = dynamic<{ data: TrendPoint[] }>(
  () => Promise.resolve(TrendChartContent),
  {
    ssr: false,
    loading: () => <ChartPlaceholder />,
  }
)

export function AnalyticsClient({
  cafe,
  summary,
  trend,
  tagCounts,
  demoMode = false,
}: Props) {
  const router = useRouter()
  const setCafe = useCafeStore((s) => s.setCafe)
  const [isPending, startTransition] = useTransition()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    setCafe(cafe)
  }, [cafe, setCafe])

  function handleRefresh() {
    setRefreshing(true)
    startTransition(() => {
      router.refresh()
      setTimeout(() => setRefreshing(false), 500)
    })
  }

  const formattedTrend = trend.map((t) => ({
    ...t,
    label: new Date(t.date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
    }),
  }))

  const stats = summary
    ? [
        {
          title: 'Toplam Müşteri',
          value: summary.total_customers,
          sub: `+${summary.new_customers} bu ay`,
          icon: Users,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
        },
        {
          title: 'Toplam Puan',
          value: summary.total_stamps,
          sub: `Bugün ${summary.today_stamps}`,
          icon: Coffee,
          color: 'text-primary',
          bg: 'bg-primary/10',
        },
        {
          title: 'Verilen Ödül',
          value: summary.total_rewards,
          sub: `${summary.redeemed_rewards} kullanıldı`,
          icon: Gift,
          color: 'text-accent',
          bg: 'bg-accent/10',
        },
        {
          title: 'VIP Müşteri',
          value: summary.vip_count,
          sub: 'Sadık & VIP',
          icon: TrendingUp,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
        },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-heading font-bold">Analitik</h1>
            {demoMode && <Badge variant="outline">Demo veri</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">Son 30 günlük performans</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || isPending}
          className="gap-2"
        >
          {refreshing || isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Yenile
        </Button>
      </div>

      {!summary ? (
        <EmptySummary />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-heading font-bold mt-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.sub}
                        </p>
                      </div>
                      <div
                        className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center',
                          stat.bg
                        )}
                      >
                        <stat.icon className={cn('h-4 w-4', stat.color)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trend chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Son 7 Gün Puan Trendi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full min-w-0">
                <TrendChart data={formattedTrend} />
              </div>
            </CardContent>
          </Card>

          {/* Tag dist */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Müşteri Segmentleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(['vip', 'loyal', 'new', 'at_risk', 'lost'] as const).map((tag, i) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      'rounded-lg p-3 border',
                      TAG_COLORS[tag]
                    )}
                  >
                    <div className="text-xs opacity-80">{TAG_LABELS[tag]}</div>
                    <div className="font-heading font-bold text-2xl mt-1">
                      {tagCounts[tag] ?? 0}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function TrendChartContent({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          strokeOpacity={0.1}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: 'var(--muted-foreground)' }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ fill: 'var(--primary)', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ChartPlaceholder() {
  return <div className="h-full rounded-lg border border-dashed border-border bg-muted/30" />
}

function EmptySummary() {
  return (
    <Card>
      <CardContent className="text-center py-16 px-4">
        <TrendingUp className="h-9 w-9 mx-auto mb-3 text-muted-foreground/40" />
        <h3 className="font-heading font-semibold mb-1">Henüz veri yok</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Müşterileriniz puan kazanmaya başladıkça analitik verileriniz burada
          görünecek.
        </p>
      </CardContent>
    </Card>
  )
}
