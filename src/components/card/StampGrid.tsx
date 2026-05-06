'use client'

import { motion } from 'framer-motion'
import { Coffee, Gift } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface StampGridProps {
  current: number
  required: number
  primaryColor: string
  rewardTitle: string
}

export function StampGrid({ current, required, primaryColor, rewardTitle }: StampGridProps) {
  const progress = Math.min((current / required) * 100, 100)
  const remaining = Math.max(required - current, 0)

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Mevcut Puan</div>
          <div className="text-3xl font-heading font-bold" style={{ color: primaryColor }}>
            {current}
            <span className="text-lg text-muted-foreground font-normal"> / {required}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Ödül</div>
          <div className="text-sm font-medium text-foreground max-w-32 text-right">{rewardTitle}</div>
        </div>
      </div>

      {/* Stamp grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: required }).map((_, i) => {
          const filled = i < current
          const isNext = i === current
          return (
            <motion.div
              key={i}
              initial={false}
              animate={filled ? { scale: [1, 1.2, 1] } : {}}
              className={`aspect-square rounded-xl flex items-center justify-center text-xl border-2 transition-all ${
                filled
                  ? 'border-transparent'
                  : isNext
                  ? 'border-dashed border-border'
                  : 'border-border bg-muted/30'
              }`}
              style={filled ? { background: primaryColor, borderColor: primaryColor } : {}}
            >
              {filled ? (
                <Coffee className="h-4 w-4 text-white" />
              ) : i === required - 1 ? (
                <Gift className="h-4 w-4 text-muted-foreground/40" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-border block" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="h-1.5 mb-2" />

      <p className="text-xs text-center text-muted-foreground">
        {remaining > 0
          ? `${remaining} puan daha → ${rewardTitle} 🎉`
          : `Tebrikler! ${rewardTitle} kazandınız 🎉`}
      </p>
    </div>
  )
}
