'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Loader2,
  Copy,
  Check,
  QrCode,
  Coffee,
  Gift,
  Palette,
  Bell,
  Store,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useCafeStore } from '@/stores/cafeStore'
import type { Cafe } from '@/types/database'

interface Props {
  cafe: Cafe
}

interface FormState {
  name: string
  description: string
  address: string
  phone: string
  instagram: string
  primary_color: string
  stamps_required: number
  reward_title: string
  reward_description: string
  whatsapp_enabled: boolean
  sms_enabled: boolean
}

export function SettingsClient({ cafe }: Props) {
  const updateCafe = useCafeStore((s) => s.updateCafe)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: cafe.name,
    description: cafe.description ?? '',
    address: cafe.address ?? '',
    phone: cafe.phone ?? '',
    instagram: cafe.instagram ?? '',
    primary_color: cafe.primary_color,
    stamps_required: cafe.stamps_required,
    reward_title: cafe.reward_title,
    reward_description: cafe.reward_description ?? '',
    whatsapp_enabled: cafe.whatsapp_enabled,
    sms_enabled: cafe.sms_enabled,
  })

  const cafeUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/card/${cafe.slug}`
      : `/card/${cafe.slug}`

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!/^#[0-9A-Fa-f]{6}$/.test(form.primary_color)) {
      toast.error('Geçerli bir renk kodu girin (örn. #6366F1)')
      return
    }
    if (form.stamps_required < 5 || form.stamps_required > 50) {
      toast.error('Puan sayısı 5-50 aralığında olmalı')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/cafe', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          address: form.address || undefined,
          phone: form.phone || undefined,
          instagram: form.instagram || undefined,
          primary_color: form.primary_color,
          stamps_required: form.stamps_required,
          reward_title: form.reward_title,
          reward_description: form.reward_description || undefined,
          whatsapp_enabled: form.whatsapp_enabled,
          sms_enabled: form.sms_enabled,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Kaydedilemedi')
        return
      }
      updateCafe(data.cafe as Cafe)
      toast.success('Ayarlar kaydedildi')
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setSaving(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cafeUrl)
      setCopied(true)
      toast.success('Bağlantı kopyalandı')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Kopyalanamadı')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Ayarlar</h1>
        <p className="text-muted-foreground text-sm">
          Kafe bilgileri, ödül kuralları ve bildirim tercihleri
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cafe info */}
        <SectionCard
          icon={Store}
          title="Kafe Bilgileri"
          description="Müşterilerinize görünen temel bilgiler"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Kafe adı *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={2}
              placeholder="Müşterilerinize görünecek kısa bir açıklama"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+90 555 555 55 55"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={form.instagram}
              onChange={(e) => update('instagram', e.target.value)}
              placeholder="@kullaniciadi"
            />
          </div>
        </SectionCard>

        {/* Reward settings */}
        <SectionCard
          icon={Gift}
          title="Ödül Ayarı"
          description="Kaç puanda ödül verilecek?"
        >
          <div className="space-y-2">
            <Label htmlFor="stamps_required">
              Gerekli puan sayısı
              <span className="text-muted-foreground ml-1">(5-50)</span>
            </Label>
            <Input
              id="stamps_required"
              type="number"
              min={5}
              max={50}
              value={form.stamps_required}
              onChange={(e) =>
                update('stamps_required', Number(e.target.value) || 10)
              }
            />
            <p className="text-xs text-muted-foreground">
              Müşteri bu sayıda puan toplayınca ödülü kazanır.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward_title">Ödül başlığı *</Label>
            <Input
              id="reward_title"
              value={form.reward_title}
              onChange={(e) => update('reward_title', e.target.value)}
              placeholder="Ücretsiz İçecek"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward_description">Ödül açıklaması</Label>
            <Textarea
              id="reward_description"
              value={form.reward_description}
              onChange={(e) => update('reward_description', e.target.value)}
              rows={2}
              placeholder="Ödülün detayları"
            />
          </div>
        </SectionCard>

        {/* Brand color */}
        <SectionCard
          icon={Palette}
          title="Marka Rengi"
          description="Müşteri kartında kullanılacak ana renk"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border border-border shrink-0"
              style={{ backgroundColor: form.primary_color }}
              aria-hidden
            />
            <div className="flex-1 space-y-2">
              <Label htmlFor="primary_color">Renk kodu</Label>
              <Input
                id="primary_color"
                value={form.primary_color}
                onChange={(e) => update('primary_color', e.target.value)}
                placeholder="#6366F1"
                className="font-mono"
              />
            </div>
            <input
              type="color"
              value={form.primary_color}
              onChange={(e) => update('primary_color', e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-border bg-transparent"
              aria-label="Renk seç"
            />
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard
          icon={Bell}
          title="Bildirim Ayarları"
          description="Müşterilerinize hangi kanaldan bildirim gönderilsin?"
        >
          <ToggleRow
            title="WhatsApp"
            description="Puan ve ödül bildirimleri WhatsApp ile gönderilsin"
            checked={form.whatsapp_enabled}
            onChange={(v) => update('whatsapp_enabled', v)}
          />
          <Separator />
          <ToggleRow
            title="SMS"
            description="OTP ve önemli bildirimler SMS ile gönderilsin"
            checked={form.sms_enabled}
            onChange={(v) => update('sms_enabled', v)}
          />
        </SectionCard>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2 min-w-32">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </form>

      {/* QR / public URL */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Kodu & Bağlantı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Bu bağlantıyı QR kod olarak masalarınıza yapıştırın. Müşterileriniz
            tarayarak puan kazanabilir.
          </p>
          <div className="flex items-center gap-2">
            <Input value={cafeUrl} readOnly className="font-mono text-xs" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Bağlantıyı kopyala"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Coffee className="h-3 w-3" />
            Slug: <span className="font-mono">{cafe.slug}</span>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
