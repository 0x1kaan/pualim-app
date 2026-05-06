import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BarChart3, Coffee, QrCode, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kafe Hesabı',
}

const authImage =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=84'

const highlights = [
  { icon: QrCode, text: 'QR sadakat kartı' },
  { icon: BarChart3, text: 'Canlı müşteri paneli' },
  { icon: ShieldCheck, text: 'KVKK odaklı akış' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-brown text-cream lg:block">
        <Image
          src={authImage}
          alt="Akşam servisine hazırlanan sıcak bir kafe alanı"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,24,16,0.94),rgba(44,24,16,0.72),rgba(44,24,16,0.28))]" />
        <div className="relative flex min-h-screen flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-amber text-brown">
              <Coffee className="size-5" />
            </span>
            <span className="font-heading text-2xl font-bold">Pualım</span>
          </Link>

          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase text-amber">Kafe hesabı</p>
            <h1 className="mt-4 font-heading text-5xl font-bold leading-tight">
              Sadakat programını birkaç dakikada yayına al.
            </h1>
            <p className="mt-5 text-lg leading-8 text-cream/70">
              Panel, QR kart ve müşteri segmentleri aynı işletme hesabında.
              Donanım kurmadan düzenli müşterileri görünür hale getir.
            </p>
            <div className="mt-8 grid gap-3">
              {highlights.map((item) => (
                <div key={item.text} className="flex items-center gap-3 border-t border-white/10 pt-3">
                  <item.icon className="size-4 text-amber" />
                  <span className="text-sm text-cream/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-cream/50">
            Pualım, Türkiye&apos;deki bağımsız kafeler için tasarlandı.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8">
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Coffee className="size-4" />
            </span>
            <span className="font-heading text-2xl font-bold">Pualım</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span>© 2026 Pualım</span>
          <Link href="/gizlilik" className="hover:text-foreground">
            Gizlilik
          </Link>
          <Link href="/kvkk" className="hover:text-foreground">
            KVKK
          </Link>
          <Link href="/kosullar" className="hover:text-foreground">
            Koşullar
          </Link>
        </div>
      </section>
    </main>
  )
}
