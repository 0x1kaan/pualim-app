'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coffee,
  Gift,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { slugify, cn } from '@/lib/utils'

interface FormState {
  name: string
  slug: string
  description: string
  stamps_required: number
  reward_title: string
  reward_description: string
}

const initialForm: FormState = {
  name: '',
  slug: '',
  description: '',
  stamps_required: 10,
  reward_title: 'Ücretsiz İçecek',
  reward_description: '',
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)

  const totalSteps = 3
  const progress = useMemo(() => ((step + 1) / totalSteps) * 100, [step])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validateStep0(): boolean {
    if (form.name.trim().length < 2) {
      toast.error('Kafe adı en az 2 karakter olmalı')
      return false
    }
    const slug = form.slug || slugify(form.name)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error('URL sadece küçük harf, rakam ve tire içerebilir')
      return false
    }
    return true
  }

  function validateStep1(): boolean {
    if (form.stamps_required < 5 || form.stamps_required > 50) {
      toast.error('Puan sayısı 5-50 aralığında olmalı')
      return false
    }
    if (form.reward_title.trim().length < 2) {
      toast.error('Ödül başlığı en az 2 karakter olmalı')
      return false
    }
    return true
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const slug = form.slug || slugify(form.name)
      const res = await fetch('/api/cafe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug,
          description: form.description || undefined,
          stamps_required: form.stamps_required,
          reward_title: form.reward_title,
          reward_description: form.reward_description || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Kafe oluşturulamadı')
        return
      }
      toast.success('Kafeniz hazır!')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setSubmitting(false)
    }
  }

  function next() {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
    } else {
      handleSubmit()
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-heading font-bold">Pualım&apos;a hoş geldin</h1>
          <p className="text-sm text-muted-foreground">
            Kafeni 1 dakikada kuralım — adım {step + 1} / {totalSteps}
          </p>
        </div>

        <Progress value={progress} className="h-1.5" />

        <Card>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <StepHeader
                    icon={Coffee}
                    title="Kafenin adı ne?"
                    description="Müşterilerinin göreceği isim"
                  />

                  <div className="space-y-2">
                    <Label htmlFor="name">Kafe adı *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => {
                        update('name', e.target.value)
                        if (!form.slug) update('slug', slugify(e.target.value))
                      }}
                      placeholder="Mocha & Co."
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      URL adresi
                      <span className="text-muted-foreground ml-1 text-xs">
                        pualim.com/card/...
                      </span>
                    </Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) =>
                        update('slug', slugify(e.target.value))
                      }
                      placeholder="mocha-co"
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Kısa açıklama</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      rows={2}
                      placeholder="Kadıköy'de butik kahve dükkanı"
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <StepHeader
                    icon={Gift}
                    title="Ödül kuralları"
                    description="Müşterilerin nasıl ödül kazanacağı"
                  />

                  <div className="space-y-2">
                    <Label htmlFor="stamps">
                      Kaç puan toplanınca ödül verilsin?
                    </Label>
                    <Input
                      id="stamps"
                      type="number"
                      min={5}
                      max={50}
                      value={form.stamps_required}
                      onChange={(e) =>
                        update(
                          'stamps_required',
                          Number(e.target.value) || 10
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Tipik değer: 8-12 puan
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward_title">Ödül başlığı *</Label>
                    <Input
                      id="reward_title"
                      value={form.reward_title}
                      onChange={(e) => update('reward_title', e.target.value)}
                      placeholder="Ücretsiz İçecek"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward_desc">Ödül açıklaması</Label>
                    <Textarea
                      id="reward_desc"
                      value={form.reward_description}
                      onChange={(e) =>
                        update('reward_description', e.target.value)
                      }
                      rows={2}
                      placeholder="İstediğin sıcak içecek bizden!"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="text-center py-6 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto"
                  >
                    <Sparkles className="h-7 w-7 text-primary" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-heading font-bold">
                      Her şey hazır!
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Kafeni oluşturup panele yönlendireceğiz.
                    </p>
                  </div>

                  <div className="bg-muted/40 rounded-xl p-4 text-left space-y-2 text-sm">
                    <SummaryRow label="Kafe" value={form.name} />
                    <SummaryRow label="URL" value={form.slug || slugify(form.name)} mono />
                    <SummaryRow
                      label="Ödül kuralı"
                      value={`${form.stamps_required} puan → ${form.reward_title}`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={back}
                disabled={step === 0 || submitting}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={submitting}
                className="gap-2 min-w-32"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : step === totalSteps - 1 ? (
                  <>
                    <Check className="h-4 w-4" />
                    Kafeyi oluştur
                  </>
                ) : (
                  <>
                    Devam
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === step
                  ? 'w-6 bg-primary'
                  : i < step
                    ? 'w-1.5 bg-primary/50'
                    : 'w-1.5 bg-muted'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StepHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h2 className="font-heading font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span
        className={cn(
          'font-medium text-right truncate',
          mono && 'font-mono text-xs'
        )}
      >
        {value}
      </span>
    </div>
  )
}
