'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Ayşe Kılıç',
    role: 'Sahibi',
    cafe: 'Fincancı Kahve · Beşiktaş',
    avatar: 'AK',
    rating: 5,
    text: 'Kurulum gerçekten 5 dakika sürdü. Müşterilerimiz artık "kartım nerede?" sorusu sormak zorunda kalmıyor. İlk haftada 40 yeni kayıt aldık.',
  },
  {
    name: 'Emre Şahin',
    role: 'İşletmeci',
    cafe: 'Roast & Toast · Kadıköy',
    avatar: 'EŞ',
    rating: 5,
    text: 'Puan talebi geldiğinde telefonuma anında bildirim düşüyor. Kasada kuyruk oluşmuyor, müşteri memnuniyeti arttı. Dashboarddaki analitikler de süper.',
  },
  {
    name: 'Selin Arslan',
    role: 'Ortak',
    cafe: 'Minör Espresso · Çankaya',
    avatar: 'SA',
    rating: 5,
    text: '"Uygulama indirmek istemiyorum" diyen müşterilerimiz için biçilmiş kaftan. QR okutuyorlar, telefon numarasını giriyorlar, hepsi bu kadar.',
  },
  {
    name: 'Tolga Yıldız',
    role: 'Kurucu',
    cafe: 'Karamel Roastery · Nişantaşı',
    avatar: 'TY',
    rating: 5,
    text: 'Hafta sonu 2x puan kampanyasını oluşturduk, pazartesi analitiğe baktık: hafta sonu ziyaret sayısı %34 artmış. Somut sonuç bu.',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="yorumlar" className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Referanslar</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Kafe sahipleri ne diyor?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            50+ kafeden gerçek geri bildirimler.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-card border border-border rounded-2xl p-6 flex flex-col gap-4"
            >
              <Quote className="absolute top-5 right-5 h-6 w-6 text-primary/10" />

              <StarRating count={t.rating} />

              <p className="text-foreground/80 leading-relaxed text-sm flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.role} · {t.cafe}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
