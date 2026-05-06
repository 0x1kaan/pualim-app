'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Eye, Coffee, Gift, Calendar, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { TAG_COLORS, TAG_LABELS, formatRelativeTime, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useCafeStore } from '@/stores/cafeStore'
import type { Cafe, Customer, CustomerTag, Stamp } from '@/types/database'

interface Props {
  cafe: Cafe
  customers: Customer[]
  demoMode?: boolean
  demoStamps?: Record<string, CustomerStamp[]>
}

type TagFilter = 'all' | CustomerTag
type CustomerStamp = Pick<Stamp, 'id' | 'approved_at' | 'multiplier'>

const TAG_FILTERS: { value: TagFilter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'vip', label: 'VIP' },
  { value: 'loyal', label: 'Sadık' },
  { value: 'new', label: 'Yeni' },
  { value: 'at_risk', label: 'Risk' },
  { value: 'lost', label: 'Kayıp' },
]

export function CustomersClient({
  cafe,
  customers,
  demoMode = false,
  demoStamps = {},
}: Props) {
  const setCafe = useCafeStore((s) => s.setCafe)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<TagFilter>('all')
  const [selected, setSelected] = useState<Customer | null>(null)
  const [selectedStamps, setSelectedStamps] = useState<CustomerStamp[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

  useEffect(() => {
    setCafe(cafe)
  }, [cafe, setCafe])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return customers.filter((c) => {
      const matchTag = tagFilter === 'all' || c.tag === tagFilter
      if (!matchTag) return false
      if (!q) return true
      const name = (c.name ?? '').toLowerCase()
      const phone = c.phone.toLowerCase()
      return name.includes(q) || phone.includes(q)
    })
  }, [customers, search, tagFilter])

  const counts = useMemo(() => {
    const acc: Record<string, number> = { all: customers.length }
    for (const c of customers) acc[c.tag] = (acc[c.tag] ?? 0) + 1
    return acc
  }, [customers])

  async function openCustomerDetail(customer: Customer) {
    setSelected(customer)
    setSelectedStamps([])
    setIsHistoryLoading(true)

    if (demoMode) {
      setSelectedStamps(demoStamps[customer.id] ?? [])
      setIsHistoryLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/customers/${customer.id}`)
      if (!res.ok) return

      const data = await res.json()
      if (data.customer) setSelected(data.customer as Customer)
      setSelectedStamps((data.stamps ?? []) as CustomerStamp[])
    } catch {
      setSelectedStamps([])
    } finally {
      setIsHistoryLoading(false)
    }
  }

  function closeCustomerDetail() {
    setSelected(null)
    setSelectedStamps([])
    setIsHistoryLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-heading font-bold">Müşteriler</h1>
            {demoMode && <Badge variant="outline">Demo veri</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">
            {cafe.name} · {customers.length} kayıtlı müşteri
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="İsim veya telefon ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TAG_FILTERS.map((t) => {
              const active = tagFilter === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTagFilter(t.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border hover:bg-muted'
                  )}
                >
                  {t.label}
                  <span className="ml-1.5 opacity-70">{counts[t.value] ?? 0}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState hasCustomers={customers.length > 0} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Etiket</TableHead>
                  <TableHead className="text-right">Puan</TableHead>
                  <TableHead className="text-right">Ziyaret</TableHead>
                  <TableHead>Son ziyaret</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {c.name ?? 'İsimsiz'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {c.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('border', TAG_COLORS[c.tag])}
                      >
                        {TAG_LABELS[c.tag]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {c.current_stamps}
                      <span className="text-muted-foreground text-xs">
                        /{cafe.stamps_required}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{c.visit_count}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatRelativeTime(c.last_visit_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => void openCustomerDetail(c)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CustomerDetailDialog
        customer={selected}
        cafe={cafe}
        stamps={selectedStamps}
        isHistoryLoading={isHistoryLoading}
        onClose={closeCustomerDetail}
      />
    </div>
  )
}

function EmptyState({ hasCustomers }: { hasCustomers: boolean }) {
  const Icon = hasCustomers ? Search : Users

  return (
    <div className="text-center py-16 px-4">
      <Icon className="h-9 w-9 mx-auto mb-3 text-muted-foreground/40" />
      <h3 className="font-heading font-semibold mb-1">
        {hasCustomers ? 'Sonuç bulunamadı' : 'Henüz müşteri yok'}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
        {hasCustomers
          ? 'Arama veya filtre kriterlerini değiştirmeyi deneyin.'
          : 'Müşterileriniz QR kodu okutup puan kazandıkça burada listelenecek.'}
      </p>
    </div>
  )
}

function CustomerDetailDialog({
  customer,
  cafe,
  stamps,
  isHistoryLoading,
  onClose,
}: {
  customer: Customer | null
  cafe: Cafe
  stamps: CustomerStamp[]
  isHistoryLoading: boolean
  onClose: () => void
}) {
  const open = customer !== null

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {customer?.name ?? 'Müşteri detayı'}
          </DialogTitle>
          <DialogDescription>
            {customer?.phone}
          </DialogDescription>
        </DialogHeader>

        {customer && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn('border', TAG_COLORS[customer.tag])}
              >
                {TAG_LABELS[customer.tag]}
              </Badge>
              {customer.whatsapp_consent && (
                <Badge variant="outline" className="text-xs">WhatsApp</Badge>
              )}
              {customer.sms_consent && (
                <Badge variant="outline" className="text-xs">SMS</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DetailStat
                icon={Coffee}
                label="Mevcut Puan"
                value={`${customer.current_stamps}/${cafe.stamps_required}`}
              />
              <DetailStat
                icon={Gift}
                label="Toplam Puan"
                value={customer.total_stamps}
              />
              <DetailStat
                icon={Users}
                label="Ziyaret"
                value={customer.visit_count}
              />
              <DetailStat
                icon={Calendar}
                label="Son Ziyaret"
                value={formatRelativeTime(customer.last_visit_at)}
              />
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{customer.phone}</span>
              </div>
              {customer.birthday && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Doğum tarihi: {formatDate(customer.birthday)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Üyelik: {formatDate(customer.created_at)}</span>
              </div>
            </div>

            {customer.notes && (
              <>
                <Separator />
                <div className="text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Notlar</div>
                  <p>{customer.notes}</p>
                </div>
              </>
            )}

            <Separator />

            <div>
              <div className="text-xs text-muted-foreground mb-2">
                Puan geçmişi
              </div>
              {isHistoryLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-3/4" />
                </div>
              ) : stamps.length === 0 ? (
                <p className="rounded-lg bg-muted/40 px-3 py-4 text-sm text-muted-foreground">
                  Henüz puan geçmişi yok.
                </p>
              ) : (
                <div className="space-y-2">
                  {stamps.map((stamp) => (
                    <div
                      key={stamp.id}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {formatDate(stamp.approved_at)}
                      </span>
                      <Badge variant="outline">
                        +{stamp.multiplier} puan
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
}) {
  return (
    <div className="bg-muted/40 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="font-heading font-bold text-lg">{value}</div>
    </div>
  )
}
