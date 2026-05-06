'use client'

import { motion } from 'framer-motion'
import { QrCode, CheckCircle2, Gift } from 'lucide-react'

const STEPS = [
  {
    icon: QrCode,
    step: '01',
    title: 'QR Kodu Tara',
    description: 'Müşteri kasadaki QR kodu kamerasıyla tarar. Uygulama indirmesine gerek yok — tarayıcıda açılır.',
    detail: 'iOS ve Android tüm kameralarda çalışır',
  },
  {
    icon: CheckCircle2,
    step: '02',
    title: 'Kafe Onaylar',
    description: 'Müşteri puan talep eder. Kafe panelinde anlık bildirim gelir. Kasiyer tek tıkla onaylar.',
    detail: 'Sahtecilik koruması dahil',
  },
  {
    icon: Gift,
    step: '03',
    title: 'Ödül Kazanılır',
    description: 'Belirli puan sayısına ulaşınca ödül otomatik tanımlanır. WhatsApp ile bildirim gönderilir.',
    detail: 'Ödülü bir sonraki ziyarette kullanır',
  },
]

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Nasıl Çalışır?</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            3 adımda sadakat programı
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Hem kafe sahibi hem müşteri için en yalın deneyim.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-border" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Step number */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-card border-2 border-border mb-6 relative z-10 mx-auto">
                <div className="text-center">
                  <step.icon className="h-8 w-8 text-primary mx-auto mb-1" />
                  <span className="text-xs font-bold text-muted-foreground">{step.step}</span>
                </div>
              </div>

              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                {step.description}
              </p>
              <span className="inline-block text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
                {step.detail}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
