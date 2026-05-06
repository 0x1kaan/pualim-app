'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'Müşteriler uygulama indirmek zorunda mı?',
    a: 'Hayır. Müşteriler QR kodu kamerasıyla tarar, kart tarayıcıda açılır. İsteyen ana ekrana ekleyebilir (PWA), ancak bu zorunlu değil.',
  },
  {
    q: 'Puan sahteciği nasıl önlüyorsunuz?',
    a: 'Her puan talebi kafe sahibinin onayını bekler. Kasiyer panelden onaylamadan puan verilmez. Ek olarak isteğe bağlı konum doğrulaması da aktif edilebilir.',
  },
  {
    q: 'Birden fazla kafem var, ne yapmalıyım?',
    a: 'Chain planı ile 5 lokasyona kadar yönetebilirsiniz. Daha fazlası için Enterprise çözümü için bizimle iletişime geçin.',
  },
  {
    q: 'WhatsApp bildirimleri nasıl gönderiliyor?',
    a: 'Twilio Business WhatsApp API üzerinden gönderilir. WhatsApp Business onayı sürecinde size destek oluyoruz.',
  },
  {
    q: 'Mevcut müşteri verilerimi aktarabilir miyim?',
    a: 'Evet. CSV yükleme ile mevcut müşteri listelerinizi içe aktarabilirsiniz. Ayrıca API erişimi ile mevcut sisteminize entegre edebilirsiniz (Pro ve Chain planlar).',
  },
  {
    q: 'Supabase/teknik bilgi gerekiyor mu?',
    a: 'Hayır. Pualım tamamen yönetilen bir platformdur. Kayıt olun, kafe bilgilerini girin, QR kodunuzu yazdırın — başlayın.',
  },
  {
    q: 'Verilerim nerede saklanıyor?',
    a: 'Supabase üzerinde AB bölgesi (Frankfurt) sunucularında, şifrelenmiş olarak saklanır. KVKK gerekliliklerine tamamen uygun.',
  },
  {
    q: 'İptal etmek istersem verilerim ne olur?',
    a: 'İptal sonrası 30 gün süre boyunca verilerinize erişebilir ve dışa aktarabilirsiniz. Sonrasında tüm veriler güvenli şekilde silinir.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="sss" className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">SSS</p>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Sık Sorulan Sorular
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-medium text-foreground text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                      open === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
