import Link from 'next/link'
import { Coffee } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Coffee className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold text-lg">Pualım</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Türkiye&apos;nin kafelerine özel dijital sadakat platformu. Uygulama indirmeden, ekstra donanım olmadan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">Ürün</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#ozellikler', label: 'Özellikler' },
                { href: '#nasil-calisir', label: 'Nasıl Çalışır?' },
                { href: '#fiyatlar', label: 'Fiyatlar' },
                { href: '#sss', label: 'SSS' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">Yasal</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/gizlilik', label: 'Gizlilik Politikası' },
                { href: '/kvkk', label: 'KVKK Aydınlatma' },
                { href: '/kosullar', label: 'Kullanım Koşulları' },
                { href: '/cerez', label: 'Çerez Politikası' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Pualım. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-muted-foreground">
            🇹🇷 Türkiye&apos;de yapıldı · KVKK Uyumlu
          </p>
        </div>
      </div>
    </footer>
  )
}
