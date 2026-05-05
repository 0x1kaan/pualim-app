'use client'

import { motion } from 'framer-motion'
import { QrCode, Bell, BarChart3, Tag, Megaphone, Shield } from 'lucide-react'

const FEATURES = [
  {
    icon: QrCode,
    title: 'QR ile Puan',
    description: 'Müşteriler QR kodu tarar, puan ister. Kafe sahibi tek tıkla onaylar. Ekstra donanım gerekmez.',
  },
  {
    icon: Bell,
    title: 'WhatsApp & SMS',
    description: 'Ödül kazanma, kampanya duyurusu ve "sizi özledik" mesajları otomatik gönderilir.',
  },
  {
    icon: BarChart3,
    title: 'Gerçek Zamanlı Analitik',
    description: 'En iyi müşterilerinizi tanıyın, ziyaret sıklığını ve ödül kullanımını takip edin.',
  },
  {
    icon: Tag,
    title: 'Müşteri Segmentasyonu',
    description: 'VIP, Sadık, Yeni, Risk ve Kayıp olarak otomatik etiketleme. Doğru kişiye doğru mesaj.',
  },
  {
    icon: Megaphone,
    title: 'Kampanya Yönetimi',
    description: 'Çarşamba günleri çift puan, akşam saatlerine özel bonus — zamanlanmış kampanyalar.',
  },
  {
    icon: Shield,
    title: 'Sahtecilik Koruması',
    description: 'Kafe sahibi her puanı manuel onaylar. Kameradan veya ekrandan tarama çalışmaz.',
  },
]

export function Features() {
  return (
    <section id="ozellikler" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Özellikler</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              İhtiyacınız olan her şey
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Pualım'ı birkaç dakikada kurun. Kafe sadakati için ihtiyacınız olan tüm araçlar tek platformda.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="h-full p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
