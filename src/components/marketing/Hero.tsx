'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Smartphone, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const STATS = [
  { value: '5 dk', label: 'Kurulum süresi' },
  { value: '0', label: 'Uygulama gerektirmez' },
  { value: '₺0', label: 'Başlangıç ücreti' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <Badge variant="secondary" className="mb-6 inline-flex gap-1.5 py-1.5 px-3">
            <Star className="h-3 w-3 text-accent fill-accent" />
            <span className="text-xs">Türkiye&#39;nin Kafe Sadakat Platformu</span>
          </Badge>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
            Müşterileriniz{' '}
            <span className="text-primary">hep geri gelsin</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            QR kod ile dijital sadakat kartı. Müşteri uygulama indirmez, siz ekstra donanım almaz.
            5 dakikada kur, ilk günden müşteri kazan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/register">
                Ücretsiz Başla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <Link href="#nasil-calisir">
                Nasıl Çalışır?
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-2xl font-heading font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <PhoneMockup />
        </motion.div>
      </div>

      {/* Social proof bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <div className="flex -space-x-2">
          {['A', 'B', 'C', 'D', 'E'].map((l) => (
            <div
              key={l}
              className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
            >
              {l}
            </div>
          ))}
        </div>
        <span>50+ kafe Pualım&#39;ı kullanıyor</span>
      </motion.div>
    </section>
  )
}

function PhoneMockup() {
  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="w-72 h-[580px] bg-foreground rounded-[44px] p-3 shadow-2xl">
        <div className="w-full h-full bg-card rounded-[36px] overflow-hidden relative">
          {/* Status bar */}
          <div className="h-12 bg-card flex items-center justify-center">
            <div className="w-24 h-6 bg-foreground/10 rounded-full" />
          </div>

          {/* App content mockup */}
          <div className="px-5 pt-4">
            {/* Cafe header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg">☕</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Aroma Kafe</div>
                <div className="text-xs text-muted-foreground">Sadakat Kartım</div>
              </div>
            </div>

            {/* Stamp grid */}
            <div className="bg-primary/5 rounded-2xl p-4 mb-4">
              <div className="text-xs text-muted-foreground mb-3">7 / 10 Puan</div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 ${
                      i < 7
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border text-muted-foreground/30'
                    }`}
                  >
                    {i < 7 ? '☕' : '○'}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                3 puan daha → Ücretsiz İçecek 🎉
              </div>
            </div>

            {/* QR area */}
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center gap-3">
              <QrCode className="h-12 w-12 text-foreground/40" />
              <div>
                <div className="text-sm font-medium">Puan İste</div>
                <div className="text-xs text-muted-foreground">Kasiyere göster</div>
              </div>
            </div>

            {/* Bottom tabs */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card px-6 py-3 flex justify-around">
              {['🎁', '📋', '⚙️'].map((icon, i) => (
                <button
                  key={i}
                  className={`text-xl ${i === 0 ? 'opacity-100' : 'opacity-40'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute -right-4 top-20 bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg"
      >
        ✓ Puan onaylandı!
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
        className="absolute -left-4 bottom-24 bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-lg"
      >
        🎉 Ödül kazandınız!
      </motion.div>

      {/* Floating phone icon */}
      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Smartphone className="h-5 w-5 text-primary" />
      </div>
    </div>
  )
}
