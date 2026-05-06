import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  Coffee,
  LineChart,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2400&q=88";

const workflow = [
  {
    title: "Kur",
    description: "Kafe adını, rengini, ödül kuralını ve bildirim tercihlerini gir.",
    icon: Coffee,
  },
  {
    title: "İşlet",
    description: "QR kodu kasaya koy; müşteri telefondan kartına girip puan ister.",
    icon: QrCode,
  },
  {
    title: "Ölç",
    description: "Tekrar ziyaret, segment ve kampanya etkisini panelden takip et.",
    icon: LineChart,
  },
];

const productMetrics = [
  { label: "Bugünkü puan", value: "48", trend: "+18%" },
  { label: "Aktif müşteri", value: "312", trend: "+34" },
  { label: "Ödül dönüşü", value: "%41", trend: "+7" },
];

const segments = [
  ["VIP", "42", "bg-primary", "w-[36%]"],
  ["Sadık", "118", "bg-green-light", "w-[84%]"],
  ["Yeni", "86", "bg-amber", "w-[64%]"],
  ["Risk", "31", "bg-brown-mid", "w-[28%]"],
];

const activity = [
  ["09:42", "Ayşe K.", "1 puan onaylandı"],
  ["10:18", "Mehmet D.", "Ödül kazandı"],
  ["11:05", "Zeynep A.", "2x kampanya kullandı"],
  ["11:27", "Ali T.", "Risk segmentine geçti"],
];

const customerSteps = [
  "Kamerayı açıp QR kodu okutur.",
  "Telefon numarasını doğrular.",
  "Kartını kaybetmeden puan toplamaya devam eder.",
];

const features = [
  {
    title: "Kafe markasıyla çalışan kart",
    description: "Logo, renk, ödül başlığı ve QR sayfası her işletmeye göre görünür.",
    icon: Sparkles,
  },
  {
    title: "Kontrollü puan onayı",
    description: "Müşteri talep eder; kafe sahibi panelden onaylar ya da reddeder.",
    icon: ShieldCheck,
  },
  {
    title: "Yerel bildirim kanalları",
    description: "Ödül, kampanya ve geri kazanım mesajları WhatsApp, SMS veya e-posta ile gider.",
    icon: MessageCircle,
  },
  {
    title: "Segmentlere göre aksiyon",
    description: "VIP, sadık, yeni, risk ve kayıp müşteriler ayrı takip edilir.",
    icon: Users,
  },
];

const plans = [
  {
    name: "Başlangıç",
    price: "₺0",
    note: "İlk deneme ve küçük hacim",
    features: ["1 lokasyon", "100 müşteriye kadar", "QR sadakat kartı"],
  },
  {
    name: "Kafe Pro",
    price: "₺299",
    note: "Bağımsız kafeler için",
    featured: true,
    features: ["Sınırsız müşteri", "Kampanya yönetimi", "WhatsApp ve SMS bildirimleri"],
  },
  {
    name: "Zincir",
    price: "₺799",
    note: "Birden çok şube",
    features: ["5 lokasyon", "Şube bazlı raporlar", "Öncelikli destek"],
  },
];

const stamps = Array.from({ length: 10 }, (_, index) => index < 7);

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-brown/10 bg-background/95 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Coffee className="size-4" />
            </span>
            <span className="font-heading text-2xl font-bold">Pualım</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#isleyis" className="transition hover:text-foreground">
              İşleyiş
            </a>
            <a href="#panel" className="transition hover:text-foreground">
              Panel
            </a>
            <a href="#musteri-karti" className="transition hover:text-foreground">
              Müşteri kartı
            </a>
            <a href="#fiyatlar" className="transition hover:text-foreground">
              Fiyatlar
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden h-10 items-center justify-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              Giriş
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Ücretsiz başla
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate min-h-[calc(88svh-4rem)] overflow-hidden">
        <Image
          src={heroImage}
          alt="Kahve hazırlanan sıcak bir kafe tezgahı"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(31,17,11,0.94),rgba(44,24,16,0.72),rgba(44,24,16,0.16))]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-background to-transparent" />

        <div className="mx-auto flex min-h-[calc(88svh-4rem)] max-w-7xl items-center px-5 py-14 sm:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-5 text-sm font-semibold uppercase text-amber">
              Türk kafeleri için dijital sadakat platformu
            </p>
            <h1 className="font-heading text-6xl font-bold leading-none sm:text-7xl lg:text-8xl">
              Pualım
            </h1>
            <p className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
              Doğru müşteri tekrar gelsin.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              Uygulama indirmeden çalışan QR sadakat kartı. Kafe sahibi puanı
              kontrol eder, müşteri ödülünü görür, panel her ziyareti ölçer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:bg-accent/90"
              >
                5 dakikada kur
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#panel"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Paneli gör
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brown/10 bg-background">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 text-sm text-muted-foreground sm:px-8 md:grid-cols-3">
          <p>
            <span className="font-semibold text-foreground">Donanım yok.</span>{" "}
            QR kod ve tarayıcı yeterli.
          </p>
          <p>
            <span className="font-semibold text-foreground">Kontrol sende.</span>{" "}
            Her puan kafe tarafından onaylanır.
          </p>
          <p>
            <span className="font-semibold text-foreground">Yerel akış.</span>{" "}
            WhatsApp, SMS ve KVKK odağıyla planlandı.
          </p>
        </div>
      </section>

      <section id="isleyis" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase text-primary">İşleyiş</p>
            <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Sadakat kartını operasyonun parçası yap.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
              Pualım fiziksel damga alışkanlığını korur; ama ölçüm, segment ve
              bildirim katmanını otomatikleştirir.
            </p>
          </div>
          <div className="grid gap-0 border-y border-brown/10 md:grid-cols-3 md:border-x">
            {workflow.map((item, index) => (
              <article
                key={item.title}
                className="border-b border-brown/10 px-0 py-8 md:border-b-0 md:border-r md:px-7 md:last:border-r-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <item.icon className="size-5 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="panel" className="bg-brown py-20 text-cream lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-amber">Kafe paneli</p>
            <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Günün ritmini tek ekrandan oku.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-cream/70">
              Puan onayları, müşteri segmentleri ve kampanya etkisi aynı
              çalışma alanında görünür.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/12 bg-[#fffaf2] text-brown shadow-2xl shadow-black/25">
            <div className="flex items-center justify-between border-b border-brown/10 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase text-brown-mid">
                  Köşe Kafe
                </p>
                <h3 className="font-heading text-xl font-bold">Canlı panel</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-green-pale px-3 py-1 text-xs font-semibold text-primary">
                <span className="size-2 rounded-full bg-primary" />
                Aktif
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1fr_0.78fr]">
              <div className="border-b border-brown/10 p-4 lg:border-b-0 lg:border-r">
                <div className="grid gap-3 sm:grid-cols-3">
                  {productMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-brown/10 bg-cream p-3">
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <div className="mt-2 flex items-end justify-between gap-2">
                        <span className="font-heading text-3xl font-bold">
                          {metric.value}
                        </span>
                        <span className="text-xs font-semibold text-primary">
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-lg border border-brown/10 bg-white">
                  <div className="flex items-center justify-between border-b border-brown/10 px-4 py-3">
                    <p className="text-sm font-semibold">Bekleyen puanlar</p>
                    <Bell className="size-4 text-primary" />
                  </div>
                  <div className="divide-y divide-brown/10">
                    {activity.map(([time, name, action]) => (
                      <div key={`${time}-${name}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                        <span className="font-mono text-xs text-muted-foreground">{time}</span>
                        <div>
                          <p className="font-semibold">{name}</p>
                          <p className="text-xs text-muted-foreground">{action}</p>
                        </div>
                        <button className="h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">
                          Onayla
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm font-semibold">Müşteri segmentleri</p>
                <div className="mt-4 space-y-3">
                  {segments.map(([label, value, color, width]) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-muted-foreground">{label}</span>
                        <span className="font-mono font-semibold">{value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-brown/10">
                        <div
                          className={`h-full rounded-full ${color} ${width}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-brown p-4 text-cream">
                  <BarChart3 className="size-5 text-amber" />
                  <p className="mt-4 font-heading text-2xl font-bold">%23</p>
                  <p className="mt-1 text-sm text-cream/70">
                    Son 30 günde tekrar ziyaret artışı
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="musteri-karti"
        className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-28"
      >
        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-lg border border-brown/10 bg-white p-4 shadow-xl shadow-green/10">
            <div className="rounded-lg bg-primary p-5 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-foreground/70">Köşe Kafe</p>
                  <h3 className="font-heading text-3xl font-bold">Sadakat kartı</h3>
                </div>
                <Coffee className="size-8" />
              </div>
              <p className="mt-6 text-sm text-primary-foreground/75">
                10 puanda bir kahve ikramı
              </p>
            </div>
            <div className="mt-5 grid grid-cols-5 gap-3">
              {stamps.map((filled, index) => (
                <div
                  key={index}
                  className={`flex aspect-square items-center justify-center rounded-full border text-sm font-bold ${
                    filled
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-brown/20 bg-cream text-muted-foreground"
                  }`}
                >
                  {filled ? <Check className="size-4" /> : index + 1}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-cream p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>7/10 puan</span>
                <span className="text-primary">3 kaldı</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-brown/10">
                <div className="h-full w-[70%] rounded-full bg-primary" />
              </div>
            </div>
            <button className="mt-4 h-12 w-full rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              Puan iste
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase text-primary">Müşteri tarafı</p>
          <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Kart deneyimi telefonda, işlem kontrolü kafede.
          </h2>
          <div className="mt-8 divide-y divide-brown/10 border-y border-brown/10">
            {customerSteps.map((item, index) => (
              <div key={item} className="flex gap-5 py-5">
                <span className="font-mono text-sm text-muted-foreground">
                  0{index + 1}
                </span>
                <p className="text-lg leading-8 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-brown/10 bg-cream py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-bold uppercase text-primary">Özellik kapsamı</p>
            <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              MVP sade, operasyon güçlü.
            </h2>
          </div>
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {features.map((feature) => (
              <article key={feature.title} className="border-t border-brown/10 pt-5">
                <feature.icon className="size-5 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="fiyatlar" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-primary">Fiyatlar</p>
            <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Küçük kafeler için erişilebilir.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Canlı ödeme entegrasyonu devreye alınana kadar erken erişim hesapları
            manuel aktive edilir.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-lg border p-6 ${
                plan.featured
                  ? "border-primary bg-white shadow-xl shadow-primary/10"
                  : "border-brown/10 bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.note}</p>
                </div>
                {plan.featured ? (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                    Önerilen
                  </span>
                ) : null}
              </div>
              <p className="mt-8 font-heading text-5xl font-bold">
                {plan.price}
                <span className="ml-1 text-base font-medium text-muted-foreground">/ay</span>
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="grid gap-8 rounded-lg bg-brown p-6 text-cream sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-amber">Erken erişim</p>
            <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              İlk kartını bugün yayına al.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-cream/70">
              Supabase projen hazır olduğunda QR, panel ve müşteri kartı akışı
              gerçek veriye bağlanır.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:bg-accent/90"
          >
            Ücretsiz hesap aç
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-brown/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="font-heading text-xl font-bold text-foreground">
            Pualım
          </Link>
          <div className="flex flex-wrap gap-5">
            <Link href="/gizlilik" className="hover:text-foreground">
              Gizlilik
            </Link>
            <Link href="/kvkk" className="hover:text-foreground">
              KVKK
            </Link>
            <Link href="/kosullar" className="hover:text-foreground">
              Koşullar
            </Link>
            <a href="mailto:destek@pualim.today" className="hover:text-foreground">
              destek@pualim.today
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
