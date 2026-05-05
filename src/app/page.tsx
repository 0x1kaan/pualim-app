import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Coffee,
  Gift,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2400&q=85";

const steps = [
  {
    title: "Markanı ekle",
    description: "Kafe adını, rengini ve ödül kuralını gir. Pualım kartın hazır olsun.",
    icon: Coffee,
  },
  {
    title: "QR kodunu koy",
    description: "Kasaya ya da masalara tek bir QR yerleştir. Müşteri uygulama indirmeden katılır.",
    icon: QrCode,
  },
  {
    title: "Geri gelenleri izle",
    description: "Kim sık geliyor, kim riskte, hangi ödül çalışıyor panelden net gör.",
    icon: BarChart3,
  },
];

const features = [
  {
    title: "Uygulama yok",
    description: "Müşteri kamerayı açar, QR okutur ve kartı tarayıcıda kullanır.",
    icon: Smartphone,
  },
  {
    title: "WhatsApp ve SMS",
    description: "Ödül, doğum günü ve geri kazanım mesajları yerel kanallardan gider.",
    icon: MessageCircle,
  },
  {
    title: "Kafe markası",
    description: "Logo, renk ve ödül dili her işletmeye göre görünür.",
    icon: Sparkles,
  },
  {
    title: "Müşteri etiketleri",
    description: "VIP, sadık, yeni, risk ve kayıp segmentleri otomatik oluşur.",
    icon: Users,
  },
  {
    title: "Ödül döngüsü",
    description: "Damga dolunca ödül oluşur, kullanım kafe tarafında onaylanır.",
    icon: Gift,
  },
  {
    title: "KVKK odağı",
    description: "Veri yapısı ve izin akışları Türkiye kullanımı için planlandı.",
    icon: ShieldCheck,
  },
];

const plans = [
  {
    name: "Başlangıç",
    price: "₺0",
    note: "İlk deneme için",
    features: ["1 lokasyon", "100 müşteriye kadar", "QR sadakat kartı"],
  },
  {
    name: "Kafe Pro",
    price: "₺299",
    note: "Bağımsız kafeler için",
    featured: true,
    features: ["Sınırsız müşteri", "WhatsApp ve SMS bildirim", "Kampanya ve segmentler"],
  },
  {
    name: "Zincir",
    price: "₺799",
    note: "Birden çok şube için",
    features: ["5 lokasyon", "Şube bazlı rapor", "Öncelikli destek"],
  },
];

const stamps = Array.from({ length: 10 }, (_, index) => index < 7);

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-brown/10 bg-background/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-heading text-2xl font-bold">
            Pualım
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#nasil-calisir" className="transition hover:text-foreground">
              Nasıl çalışır
            </a>
            <a href="#musteri-karti" className="transition hover:text-foreground">
              Müşteri kartı
            </a>
            <a href="#fiyatlar" className="transition hover:text-foreground">
              Fiyatlar
            </a>
          </div>
          <a
            href="#erken-erisim"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Ücretsiz başla
          </a>
        </nav>
      </header>

      <section className="relative isolate min-h-[82svh] overflow-hidden">
        <Image
          src={heroImage}
          alt="Kahve hazırlanan sıcak bir kafe tezgahı"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(44,24,16,0.92),rgba(44,24,16,0.62),rgba(44,24,16,0.14))]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="mx-auto flex min-h-[82svh] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-3xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur">
              <Coffee className="size-4" />
              Türk kafeler için yapıldı
            </div>
            <h1 className="font-heading text-6xl font-bold leading-none sm:text-7xl lg:text-8xl">
              Pualım
            </h1>
            <p className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
              Müşterilerin hep geri gelsin.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              Kafeye özel dijital sadakat kartı. Kurulum dakikalar içinde,
              müşteri için uygulama yok, işletme için ölçülebilir tekrar ziyaret var.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#erken-erisim"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:bg-accent/90"
              >
                Ücretsiz başla
                <ArrowRight className="size-4" />
              </a>
              <a
                href="#nasil-calisir"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Nasıl çalışır?
              </a>
            </div>
            <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-6">
              {[
                ["5 dk", "kurulum"],
                ["₺0", "başlangıç"],
                ["10", "damgada ödül"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-heading text-3xl font-bold">{value}</dt>
                  <dd className="mt-1 text-sm text-white/70">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="nasil-calisir" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase text-primary">Kafe sahibi için</p>
          <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            3 adımda sadakat programın hazır.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Pualım, fiziksel damga kartının alışkanlığını korur ve ölçülebilir hale getirir.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-lg border border-brown/10 bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-primary">
                <step.icon className="size-5" />
              </div>
              <p className="mt-6 text-sm font-bold text-muted-foreground">
                0{index + 1}
              </p>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brown py-20 text-cream lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase text-amber">Özellikler</p>
            <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Her şey dahil, fazlası değil.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-cream/70">
              MVP odağı net: sadakat kartı, müşteri görünürlüğü, ödül ve yerel bildirimler.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
              >
                <feature.icon className="size-5 text-amber" />
                <h3 className="mt-4 font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-cream/70">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="musteri-karti"
        className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-28"
      >
        <div className="rounded-lg border border-green/20 bg-green-pale p-5 sm:p-8">
          <div className="mx-auto max-w-sm rounded-lg bg-white p-5 shadow-xl shadow-green/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Köşe Kafe</p>
                <h3 className="font-heading text-3xl font-bold">Sadakat kartı</h3>
              </div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-brown text-cream">
                <Coffee className="size-6" />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-5 gap-3">
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
            <div className="mt-7 rounded-lg bg-cream p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>7/10 damga</span>
                <span className="text-primary">3 kaldı</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-brown/10">
                <div className="h-full w-[70%] rounded-full bg-primary" />
              </div>
            </div>
            <button className="mt-5 h-12 w-full rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              Damga talep et
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase text-primary">Müşteri için</p>
          <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Cüzdanda yer kaplayan kart bitti.
          </h2>
          <div className="mt-8 space-y-5">
            {[
              "QR okut, telefonunu doğrula ve kartını hemen aç.",
              "Ödül kazanınca WhatsApp ya da SMS ile haber al.",
              "Her kafenin kartı ayrı, ama hepsi telefonda durur.",
            ].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" />
                </div>
                <p className="text-lg leading-8 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fiyatlar" className="border-y border-brown/10 bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-primary">Fiyatlar</p>
            <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Dürüst, sade fiyatlandırma.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-lg border p-6 ${
                  plan.featured
                    ? "border-primary bg-white shadow-xl shadow-primary/10"
                    : "border-brown/10 bg-white/70"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.note}</p>
                  </div>
                  {plan.featured ? (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                      En uygun
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
        </div>
      </section>

      <section id="erken-erisim" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 rounded-lg bg-brown p-6 text-cream sm:p-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-amber">Erken erişim</p>
            <h2 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              İlk 14 gün tamamen ücretsiz.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-cream/70">
              Kredi kartı gerekmez. QR kartını kur, ilk müşterilerini gör, sonra karar ver.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <label className="sr-only" htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="kafe@ornek.com"
              className="h-12 min-w-0 flex-1 rounded-lg border border-white/20 bg-white px-4 text-sm text-brown outline-none transition placeholder:text-brown/40 focus:border-amber"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-bold text-accent-foreground transition hover:bg-accent/90"
            >
              Başla
              <ArrowRight className="size-4" />
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-brown/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-heading text-xl font-bold text-foreground">Pualım</p>
          <div className="flex flex-wrap gap-5">
            <a href="mailto:destek@pualim.today" className="hover:text-foreground">
              destek@pualim.today
            </a>
            <a href="#fiyatlar" className="hover:text-foreground">
              Fiyatlar
            </a>
            <a href="#erken-erisim" className="hover:text-foreground">
              Erken erişim
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
