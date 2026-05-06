'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Megaphone,
  Calendar,
  Sparkles,
  Lock,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate, cn } from '@/lib/utils'
import type { Cafe, Campaign } from '@/types/database'

interface Props {
  cafe: Cafe
  initialCampaigns: Campaign[]
}

interface FormState {
  name: string
  description: string
  starts_at: string
  ends_at: string
  stamp_multiplier: number
  bonus_stamps: number
}

const initialForm: FormState = {
  name: '',
  description: '',
  starts_at: '',
  ends_at: '',
  stamp_multiplier: 2,
  bonus_stamps: 0,
}

export function CampaignsClient({ cafe, initialCampaigns }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [openForm, setOpenForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(initialForm)

  const isStarter = cafe.plan === 'starter'

  function resetForm() {
    setForm(initialForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isStarter) {
      toast.error('Kampanya yönetimi Pro plana özel')
      return
    }

    if (!form.name || !form.starts_at || !form.ends_at) {
      toast.error('Lütfen zorunlu alanları doldurun')
      return
    }

    if (new Date(form.ends_at) <= new Date(form.starts_at)) {
      toast.error('Bitiş tarihi başlangıçtan sonra olmalı')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          starts_at: new Date(form.starts_at).toISOString(),
          ends_at: new Date(form.ends_at).toISOString(),
          stamp_multiplier: form.stamp_multiplier,
          bonus_stamps: form.bonus_stamps,
          is_active: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Kampanya oluşturulamadı')
        return
      }
      setCampaigns((prev) => [data.campaign as Campaign, ...prev])
      toast.success('Kampanya oluşturuldu')
      setOpenForm(false)
      resetForm()
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleActive(c: Campaign) {
    setTogglingId(c.id)
    const next = !c.is_active
    try {
      const res = await fetch(`/api/campaigns/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: next }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? 'Güncelleme başarısız')
        return
      }
      setCampaigns((prev) =>
        prev.map((p) => (p.id === c.id ? { ...p, is_active: next } : p))
      )
      toast.success(next ? 'Kampanya aktif' : 'Kampanya pasif')
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading font-bold">Kampanyalar</h1>
          <p className="text-muted-foreground text-sm">
            Çarpan ve bonus puan kampanyaları
          </p>
        </div>
        <Button
          onClick={() => setOpenForm(true)}
          disabled={isStarter}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni Kampanya
        </Button>
      </div>

      {isStarter && <StarterUpgrade />}

      {campaigns.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c, i) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              index={i}
              toggling={togglingId === c.id}
              onToggle={() => toggleActive(c)}
            />
          ))}
        </div>
      )}

      <Dialog open={openForm} onOpenChange={(v) => { if (!v) { setOpenForm(false); resetForm() } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Kampanya</DialogTitle>
            <DialogDescription>
              Belirli bir tarih aralığında çarpan veya bonus puan kampanyası oluşturun.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Kampanya adı *</Label>
              <Input
                id="campaign-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Hafta Sonu 2x Puan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-desc">Açıklama</Label>
              <Textarea
                id="campaign-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Kampanya hakkında kısa bilgi"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="starts">Başlangıç *</Label>
                <Input
                  id="starts"
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ends">Bitiş *</Label>
                <Input
                  id="ends"
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="multiplier">Çarpan (1-5)</Label>
                <Input
                  id="multiplier"
                  type="number"
                  min={1}
                  max={5}
                  value={form.stamp_multiplier}
                  onChange={(e) =>
                    setForm({ ...form, stamp_multiplier: Number(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bonus">Bonus puan</Label>
                <Input
                  id="bonus"
                  type="number"
                  min={0}
                  max={50}
                  value={form.bonus_stamps}
                  onChange={(e) =>
                    setForm({ ...form, bonus_stamps: Number(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setOpenForm(false); resetForm() }}
                disabled={submitting}
              >
                İptal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Oluşturuluyor...
                  </>
                ) : (
                  'Oluştur'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StarterUpgrade() {
  return (
    <Card className="border-yellow-400/30 bg-yellow-400/5">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-yellow-400/15 flex items-center justify-center shrink-0">
          <Lock className="h-4 w-4 text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-sm">
            Kampanyalar Pro plana özeldir
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Çarpan ve bonus puan kampanyaları oluşturmak için Pro plana yükseltin.
          </p>
        </div>
        <Button size="sm" variant="outline" disabled>
          Yükselt
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="text-center py-16 px-4">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="font-heading font-semibold mb-1">Henüz kampanya yok</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Hafta sonu 2x puan, doğum gününde bonus gibi kampanyalar oluşturarak
          müşterilerinizi ödüllendirin.
        </p>
      </CardContent>
    </Card>
  )
}

function CampaignCard({
  campaign,
  index,
  toggling,
  onToggle,
}: {
  campaign: Campaign
  index: number
  toggling: boolean
  onToggle: () => void
}) {
  const now = Date.now()
  const isFuture = new Date(campaign.starts_at).getTime() > now
  const isPast = new Date(campaign.ends_at).getTime() < now
  const status = isPast
    ? { label: 'Bitti', cls: 'text-muted-foreground bg-muted' }
    : isFuture
      ? { label: 'Yaklaşan', cls: 'text-blue-400 bg-blue-400/10' }
      : campaign.is_active
        ? { label: 'Aktif', cls: 'text-green-400 bg-green-400/10' }
        : { label: 'Pasif', cls: 'text-muted-foreground bg-muted' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Megaphone className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base truncate">{campaign.name}</CardTitle>
                {campaign.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {campaign.description}
                  </p>
                )}
              </div>
            </div>
            <Badge variant="outline" className={cn('shrink-0', status.cls)}>
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(campaign.starts_at)} → {formatDate(campaign.ends_at)}
          </div>

          <div className="flex items-center gap-2">
            {campaign.stamp_multiplier > 1 && (
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {campaign.stamp_multiplier}x puan
              </Badge>
            )}
            {campaign.bonus_stamps > 0 && (
              <Badge variant="outline">
                +{campaign.bonus_stamps} bonus
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {campaign.is_active ? 'Aktif' : 'Pasif'}
            </span>
            <div className="flex items-center gap-2">
              {toggling && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              <Switch
                checked={campaign.is_active}
                onCheckedChange={onToggle}
                disabled={toggling || isPast}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
