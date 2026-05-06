# Pualım — Geliştirme Kılavuzu & İlerleme Kaydı

> Bu dosya, projeyi geliştiren herkesin (insan veya yapay zeka) tam olarak nerede olduğunu, 
> ne yapıldığını ve sıradaki adımın ne olduğunu anlaması için tutulur.
> Her oturumda bu dosyayı oku, sonra güncelle.

---

## Proje Nedir?

**Pualım** — Türkiye'deki bağımsız kafelere yönelik QR tabanlı dijital sadakat kartı SaaS platformu.

- Kafe sahipleri panel açar, QR kod üretir
- Müşteriler QR kodu tarar, telefon numarasıyla kayıt olur
- Her ziyarette puan birikir, belirli sayıda puana ulaşınca ödül kazanılır
- Kafe sahibi müşteri davranışlarını analiz eder, kampanya yönetir
- WhatsApp/SMS ile otomatik bildirimler gider

**Domain:** pualim.today  
**Fiyatlandırma:** ₺0 / ₺299 / ₺799 (Starter/Pro/Chain)

---

## Proje Dizini

```
C:\Users\Yigit Kaan\OneDrive\Desktop\Pualim\pualim-app\
```

---

## Tech Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Framework | Next.js | 15 (App Router) |
| Dil | TypeScript | strict mode |
| Stil | Tailwind CSS v4 + shadcn/ui | latest |
| Animasyon | Framer Motion | latest |
| DB + Auth | Supabase (PostgreSQL + Auth + Realtime) | latest |
| Validasyon | Zod | latest |
| Global state | Zustand | latest |
| Server state | TanStack React Query | latest |
| QR Kod | qrcode.react | latest |
| Grafikler | Recharts | latest |
| SMS | Netgsm | REST API |
| WhatsApp | Twilio | SDK |
| Email | Resend | SDK |
| Bildirimler | Sonner (toast) | shadcn |
| Package mgr | npm | - |

---

## Tema & Marka Renkleri

globals.css tarafından belirlenen tema (linter/kullanıcı tarafından güncellendi):

```css
/* Light (Varsayılan) */
--background: #fbf7f0        /* Krem */
--foreground: #2c1810        /* Kahve */
--primary: #2d5016           /* Yeşil (kafe) */
--accent: #e8a045            /* Amber/Altın */
--card: #fffaf2

/* Dark Mode */
--background: #2c1810
--primary: #e8a045
```

Font: DM Sans (body) + Playfair Display (heading) — Google Fonts  
Tasarım dili: Sıcak, organik, kafe estetiği

---

## Klasör Yapısı (Planlanan)

```
src/
├── app/
│   ├── (marketing)/page.tsx        ← Landing page (ROOT)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Sidebar + header
│   │   ├── dashboard/page.tsx      ← Ana panel
│   │   ├── customers/page.tsx
│   │   ├── customers/[id]/page.tsx
│   │   ├── campaigns/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── card/[slug]/page.tsx        ← Müşteri kartı (public)
│   ├── api/                        ← Tüm API route'ları
│   │   ├── auth/send-otp/route.ts
│   │   ├── auth/verify-otp/route.ts
│   │   ├── cafe/route.ts
│   │   ├── cafe/logo/route.ts
│   │   ├── customers/route.ts
│   │   ├── customers/[id]/route.ts
│   │   ├── stamps/request/route.ts
│   │   ├── stamps/approve/route.ts
│   │   ├── rewards/redeem/route.ts
│   │   ├── campaigns/route.ts
│   │   ├── analytics/summary/route.ts
│   │   └── notifications/send/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                         ← shadcn/ui (OLUŞTURULDU)
│   ├── marketing/                  ← Landing page bölümleri
│   ├── dashboard/                  ← Panel komponentleri
│   └── card/                       ← Müşteri kartı komponentleri
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ← TAMAMLANDI
│   │   ├── server.ts               ← TAMAMLANDI
│   │   └── admin.ts                ← TAMAMLANDI
│   ├── validations/
│   │   ├── cafe.ts                 ← TAMAMLANDI
│   │   ├── customer.ts
│   │   └── campaign.ts
│   ├── notifications/
│   │   ├── sms.ts
│   │   ├── whatsapp.ts
│   │   └── email.ts
│   ├── utils.ts                    ← TAMAMLANDI
│   └── constants.ts
├── hooks/
│   ├── useRealtimeStamps.ts
│   ├── useCustomers.ts
│   └── useCafe.ts
├── stores/
│   └── cafeStore.ts
├── types/
│   ├── database.ts                 ← TAMAMLANDI
│   └── index.ts
├── middleware.ts                   ← Auth guard
supabase/
└── migrations/
    ├── 001_initial_schema.sql      ← TAMAMLANDI
    ├── 002_rls_policies.sql        ← TAMAMLANDI
    └── 003_functions_triggers.sql  ← TAMAMLANDI
```

---

## Ortam Değişkenleri (.env.local)

`.env.local.example` dosyasını kopyala ve doldur:

```bash
cp .env.local.example .env.local
```

Gereken değerler:
```env
NEXT_PUBLIC_SUPABASE_URL=         # Supabase proje URL'i
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key (gizli!)
JWT_SECRET=                       # Rastgele 32+ karakter
NETGSM_USERCODE=                  # Netgsm hesap kodu
NETGSM_PASSWORD=                  # Netgsm şifresi
NETGSM_MSGHEADER=PUALIM           # SMS gönderici adı
TWILIO_ACCOUNT_SID=               # Twilio hesap SID
TWILIO_AUTH_TOKEN=                # Twilio auth token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
RESEND_API_KEY=                   # Resend API key
RESEND_FROM_EMAIL=noreply@pualim.today
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Veritabanı Kurulumu

Supabase dashboard'da SQL Editor'ü aç ve sırayla çalıştır:

1. `supabase/migrations/001_initial_schema.sql` — Tablolar
2. `supabase/migrations/002_rls_policies.sql` — Güvenlik politikaları
3. `supabase/migrations/003_functions_triggers.sql` — Fonksiyon ve triggerlar

**Önemli:** Supabase'de Realtime'ı etkinleştir:
- `pending_stamps` tablosu için Realtime INSERT olayını etkinleştir
- `stamps` tablosu için Realtime INSERT olayını etkinleştir

---

## Geliştirme Komutları

```bash
cd "C:\Users\Yigit Kaan\OneDrive\Desktop\Pualim\pualim-app"

npm run dev      # Geliştirme sunucusu → http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint kontrolü
```

---

## ✅ TAMAMLANAN ADIMLAR

### Oturum 1 — Proje Kurulumu (2026-05-05/06)

#### 1.1 Next.js 14 Projesi
- [x] `create-next-app` ile Next.js 14 + TypeScript + Tailwind + App Router
- [x] Proje dizini: `pualim-app/`
- [x] `src/` dizin yapısı kullanılıyor
- [x] `@/*` import alias aktif

#### 1.2 Bağımlılıklar (npm install)
Kurulan paketler:
- `@supabase/supabase-js` + `@supabase/ssr` — Supabase client
- `framer-motion` — Animasyonlar
- `zustand` — Global state
- `@tanstack/react-query` — Server state
- `zod` — Validasyon
- `qrcode.react` — QR kod üretimi
- `recharts` — Grafikler
- `resend` — Email
- `twilio` — WhatsApp
- `lucide-react` — İkonlar
- `class-variance-authority` + `clsx` + `tailwind-merge` — Stil yardımcıları
- `sonner` — Toast bildirimleri
- `date-fns` — Tarih işlemleri
- `jose` — JWT işlemleri
- Radix UI primitifleri (dialog, dropdown, select, tabs, vb.)

#### 1.3 shadcn/ui Kurulumu
- [x] `npx shadcn@latest init --defaults`
- [x] Tailwind CSS v4 uyumlu başlatma
- [x] Eklenen bileşenler: button, card, input, label, select, tabs, dialog, dropdown-menu, avatar, switch, progress, separator, badge, sonner, sheet, alert-dialog, popover, scroll-area, table, form, textarea, checkbox, skeleton, tooltip, calendar, command

#### 1.4 Konfigürasyon Dosyaları
- [x] `src/app/globals.css` — Pualım tema renkleri (kahve/yeşil/krem)
- [x] `next.config.ts` — Image domains, güvenlik headers
- [x] `.env.local.example` — Tüm gerekli env değişkenleri

#### 1.5 Supabase Migration Dosyaları
- [x] `supabase/migrations/001_initial_schema.sql` — 8 tablo: cafes, customers, pending_stamps, stamps, rewards, campaigns, notifications, otps
- [x] `supabase/migrations/002_rls_policies.sql` — RLS politikaları
- [x] `supabase/migrations/003_functions_triggers.sql` — Triggerlar, analizler, auto-tagging

#### 1.6 Temel Kütüphane Dosyaları
- [x] `src/lib/supabase/client.ts` — Browser Supabase client
- [x] `src/lib/supabase/server.ts` — Server-side Supabase client (cookies)
- [x] `src/lib/supabase/admin.ts` — Service role client (API routes için)
- [x] `src/lib/utils.ts` — cn(), slugify(), formatPhone(), formatDate(), generateOTP(), TAG_LABELS, TAG_COLORS
- [x] `src/types/database.ts` — Tüm Supabase tip tanımları (Database, Cafe, Customer, Stamp, vb.)
- [x] `src/lib/validations/cafe.ts` — Zod şemaları: cafeCreateSchema, cafeUpdateSchema

---

## ✅ TAMAMLANAN ADIMLAR (DEVAM)

### Oturum 2 — Tam Uygulama (2026-05-05)

#### 2.1 Kalan Lib & Validasyon Dosyaları
- [x] `src/lib/validations/customer.ts` — otpRequestSchema, otpVerifySchema
- [x] `src/lib/validations/campaign.ts` — campaignSchema, campaignUpdateSchema (refine ayrıştırma ile)
- [x] `src/lib/notifications/sms.ts` — Netgsm REST API entegrasyonu
- [x] `src/lib/notifications/whatsapp.ts` — Twilio SDK entegrasyonu
- [x] `src/lib/notifications/email.ts` — Resend SDK entegrasyonu
- [x] `src/lib/constants.ts` — PLANS, TAG_LABELS/COLORS, vb.
- [x] `src/types/index.ts`
- [x] `src/stores/cafeStore.ts` — Zustand global state

#### 2.2 Auth Sistemi
- [x] `src/middleware.ts` — Supabase SSR auth guard
- [x] `src/app/(auth)/layout.tsx`
- [x] `src/app/(auth)/login/page.tsx`
- [x] `src/app/(auth)/register/page.tsx`

#### 2.3 Root Layout & Providers
- [x] `src/app/layout.tsx` — Google Fonts, Sonner, Providers
- [x] `src/app/opengraph-image.tsx`
- [x] `src/app/sitemap.xml/route.ts`
- [x] `src/app/robots.txt/route.ts`

#### 2.4 Landing Page
- [x] `src/components/marketing/Navbar.tsx` — Sabit navbar, scroll efekti
- [x] `src/components/marketing/Hero.tsx` — Animasyonlu hero, stat cards
- [x] `src/components/marketing/Features.tsx` — 6 özellik kartı
- [x] `src/components/marketing/HowItWorks.tsx` — 3 adım flow
- [x] `src/components/marketing/Pricing.tsx` — 3 plan (Starter/Pro/Chain)
- [x] `src/components/marketing/Testimonials.tsx` — Kafe sahibi yorumları
- [x] `src/components/marketing/FAQ.tsx` — Accordion SSS
- [x] `src/components/marketing/Footer.tsx`
- [x] `src/app/(marketing)/page.tsx`

#### 2.5 Müşteri Kart Sayfası
- [x] `src/components/card/LoyaltyCardClient.tsx` — Ana kart client bileşeni
- [x] `src/components/card/StampGrid.tsx` — Puan grid görselleştirmesi
- [x] `src/components/card/RewardsList.tsx` — Ödüller listesi
- [x] `src/components/card/VisitHistory.tsx` — Ziyaret geçmişi
- [x] `src/components/card/OTPModal.tsx` — Telefon + OTP modal
- [x] `src/app/card/[slug]/page.tsx` — Server component, kafe verisini yükler

#### 2.6 API Routes (Tümü)
- [x] `src/app/api/auth/send-otp/route.ts` — Rate limit, OTP kaydet, SMS gönder
- [x] `src/app/api/auth/verify-otp/route.ts` — OTP doğrula, müşteri oluştur/bul, JWT üret
- [x] `src/app/api/cafe/route.ts` — GET + POST + PATCH
- [x] `src/app/api/customers/route.ts` — GET (arama, filtre, pagination)
- [x] `src/app/api/customers/[id]/route.ts` — GET + PATCH (not, tag, doğum günü)
- [x] `src/app/api/stamps/request/route.ts` — JWT auth, pending_stamp oluştur
- [x] `src/app/api/stamps/approve/route.ts` — Kafe sahibi onayla/reddet, kampanya multiplier
- [x] `src/app/api/rewards/redeem/route.ts` — JWT auth, ödül kullan
- [x] `src/app/api/campaigns/route.ts` — GET + POST
- [x] `src/app/api/campaigns/[id]/route.ts` — PATCH + DELETE
- [x] `src/app/api/analytics/summary/route.ts` — RPC + trend verisi
- [x] `src/app/api/card/[slug]/customer/route.ts` — JWT auth, müşteri verisi
- [x] `src/app/api/card/rewards/route.ts` — JWT auth, ödüller
- [x] `src/app/api/card/history/route.ts` — JWT auth, ziyaret geçmişi

#### 2.7 Dashboard
- [x] `src/components/dashboard/Sidebar.tsx` — Collapsible sidebar
- [x] `src/components/dashboard/Header.tsx` — Mobile hamburger, kafe adı
- [x] `src/app/(dashboard)/layout.tsx` — Sidebar + header layout
- [x] `src/app/(dashboard)/dashboard/page.tsx` + `DashboardClient.tsx` — Stats + Realtime stamp approval
- [x] `src/app/(dashboard)/customers/page.tsx` + `CustomersClient.tsx` — Tablo, filtre, modal
- [x] `src/app/(dashboard)/campaigns/page.tsx` + `CampaignsClient.tsx` — Liste + yeni kampanya formu
- [x] `src/app/(dashboard)/analytics/page.tsx` + `AnalyticsClient.tsx` — Grafikler (Recharts)
- [x] `src/app/(dashboard)/settings/page.tsx` + `SettingsClient.tsx` — Profil, QR kod, bildirim ayarları
- [x] `src/app/(dashboard)/onboarding/page.tsx` — İlk kafe kurulum formu

#### 2.8 PWA
- [x] `public/manifest.json` — PWA manifest
- [x] `src/app/layout.tsx` metadata'ya manifest eklendi

#### 2.9 TypeScript Build Fix (2026-05-05)
Supabase JS v2 + TypeScript strict mode + Next.js 16 uyumsuzlukları giderildi:

**Sorunlar ve Çözümler:**
- `ZodError.errors` → `ZodError.issues` (Zod v4 breaking change) — tüm API routes'ta düzeltildi
- `Button asChild` → `buttonVariants({ ... })` ile `<Link>` (Base UI'da `asChild` yok) — Hero, Navbar, Pricing, Register
- `SheetTrigger asChild` → `render={<Button />}` (Base UI render prop) — Header
- Supabase query chain `never` tipi → tüm `.from().select/insert/update/delete()` zincirlerine `(supabase as any)` cast eklendi
- `campaignSchema.partial()` hatası → base schema ayrıştırıldı, refine sadece ana schema'ya uygulandı
- `Database` interface eksik `Views/Enums/CompositeTypes` → eklendi
- `return redirect()` pattern → tüm dashboard page'lerinde uygulandı

**Sonuç:** `npm run build` sıfır TypeScript hatası ile geçiyor ✅

---

## 🔲 KALAN ADIMLAR

### Supabase Kurulumu (Henüz Yapılmadı)
- [ ] Supabase projesi oluştur
- [ ] `.env.local` dosyasını doldur
- [ ] Migration'ları SQL Editor'de çalıştır
- [ ] `pending_stamps` ve `stamps` tablolarında Realtime etkinleştir

### Production Hazırlık
- [ ] Netgsm hesabı + SMS header onayı
- [ ] Twilio hesabı + WhatsApp sandbox
- [ ] Resend API key + domain doğrulaması
- [ ] Vercel deploy + env variables
- [ ] Custom domain (pualim.today) DNS ayarları

---

## Önemli Tasarım Kararları

### Auth Akışı
1. Kafe sahibi → email/şifre ile Supabase Auth
2. Müşteri → telefon + SMS OTP → `jose` ile JWT token → localStorage'da saklanır
3. Dashboard sayfaları: Supabase session kontrolü (middleware)
4. Kart sayfası: Public + opsiyonel OTP

### Stamp Akışı
```
Müşteri QR tarar → /card/[slug] açılır → "Puan İste" tıklar
→ Telefon girer → OTP doğrular → pending_stamps tablosuna INSERT
→ Kafe sahibi panelde gerçek zamanlı bildirim alır (Supabase Realtime)
→ "Onayla" tıklar → stamps tablosuna INSERT
→ Trigger otomatik: customer_stats günceller, ödül oluşturur
```

### Müşteri Tagging Mantığı
```
VIP:     visit_count >= 20 VE son 30 gün içinde geldi
Sadık:   visit_count >= 8  VE son 30 gün içinde geldi
Yeni:    son 60 gün içinde geldi VEYA hiç gelmedi
Risk:    son 90 gün içinde geldi
Kayıp:   90 günden fazla gelmedi
```

### RLS Mimarisi
- Kafe sahipleri YALNIZCA kendi kafe verilerini görür
- API route'larında admin client kullanılır (service_role)
- Public endpoint'ler: `/card/[slug]` (müşteri kartı), `/api/auth/*` (OTP)
- Tüm diğer API'ler: Supabase session ile korunur

---

## Bilinen Sorunlar / Notlar

- `globals.css` tema renkleri (kahve/yeşil/krem) kullanıcı/linter tarafından güncellendi. Bu temayı koru.
- `next.config.ts` turbopack konfigürasyonu eklendi.
- shadcn/ui v4 Tailwind ile uyumlu (shadcn/tailwind.css import ile).
- `@radix-ui/react-badge` paketi npm'de yok, shadcn badge bileşeni kullanılıyor.

---

## Oturum Geçmişi

| Tarih | Yapılan | Kim |
|-------|---------|-----|
| 2026-05-05 | Proje kurulumu, DB schema, temel lib dosyaları | Claude (Hızır) |
| 2026-05-05 | Tüm uygulama tamamlandı: landing page, kart sayfası, tüm API routes, dashboard | Claude (Hızır) |
| 2026-05-05 | TypeScript build fix: Zod v4, Base UI asChild, Supabase any cast, campaign.partial() | Claude (Hızır) |

---

*Bu dosyayı her geliştirme oturumundan önce oku, sonunda güncelle.*
