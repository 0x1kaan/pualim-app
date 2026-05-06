'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/constants'

export function Pricing() {
  const plans = Object.values(PLANS)

  return (
    <section id="fiyatlar" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Fiyatlar</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Kafenizin büyüklüğüne göre
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Başlangıç ücreti yok. İstediğiniz zaman planı değiştirin.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isPro = plan.name === 'Pro'
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 border ${
                  isPro
                    ? 'border-primary bg-primary text-primary-foreground shadow-xl scale-105'
                    : 'border-border bg-card'
                }`}
              >
                {'badge' in plan && (
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground border-0 gap-1"
                  >
                    <Zap className="h-3 w-3" />
                    {plan.badge as string}
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className={`font-heading font-bold text-xl mb-1 ${isPro ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className={`text-4xl font-heading font-bold ${isPro ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {plan.currency}{plan.price}
                    </span>
                    <span className={`text-sm ${isPro ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${isPro ? 'text-primary-foreground/80' : 'text-primary'}`} />
                      <span className={isPro ? 'text-primary-foreground/90' : 'text-muted-foreground'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === 'Chain' ? '#iletisim' : '/register'}
                  className={buttonVariants({
                    variant: isPro ? 'secondary' : plan.name === 'Chain' ? 'outline' : 'default',
                    className: `w-full ${isPro ? 'bg-white text-primary hover:bg-white/90' : ''}`,
                  })}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Yıllık ödemede 2 ay ücretsiz · İstediğiniz zaman iptal edin · KVKK uyumlu
        </p>
      </div>
    </section>
  )
}
