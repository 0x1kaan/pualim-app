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

## 🔲 YAPILACAKLAR (Sıralı)

### ADIM 2 — Kalan Lib Dosyaları
- [ ] `src/lib/validations/customer.ts`
- [ ] `src/lib/validations/campaign.ts`
- [ ] `src/lib/notifications/sms.ts` (Netgsm)
- [ ] `src/lib/notifications/whatsapp.ts` (Twilio)
- [ ] `src/lib/notifications/email.ts` (Resend)
- [ ] `src/lib/constants.ts`
- [ ] `src/types/index.ts`
- [ ] `src/stores/cafeStore.ts` (Zustand)

### ADIM 3 — Auth Sistemi
- [ ] `src/middleware.ts` — Auth guard, route koruması
- [ ] `src/app/(auth)/layout.tsx`
- [ ] `src/app/(auth)/login/page.tsx`
- [ ] `src/app/(auth)/register/page.tsx`

### ADIM 4 — Root Layout & Providers
- [ ] `src/app/layout.tsx` — Font setup, providers, Sonner
- [ ] QueryClient provider wrapper
- [ ] TooltipProvider wrapper

### ADIM 5 — Landing Page
Bölümler (sırayla):
- [ ] `src/components/marketing/Navbar.tsx`
- [ ] `src/components/marketing/Hero.tsx`
- [ ] `src/components/marketing/Features.tsx`
- [ ] `src/components/marketing/HowItWorks.tsx`
- [ ] `src/components/marketing/Pricing.tsx`
- [ ] `src/components/marketing/Testimonials.tsx`
- [ ] `src/components/marketing/FAQ.tsx`
- [ ] `src/components/marketing/Footer.tsx`
- [ ] `src/app/(marketing)/page.tsx` — Hepsini bir araya getirir
- [ ] `src/app/(marketing)/layout.tsx`

### ADIM 6 — Müşteri Kart Sayfası
- [ ] `src/components/card/LoyaltyCard.tsx` — Ana kart bileşeni
- [ ] `src/components/card/StampGrid.tsx` — Puan grid gösterimi
- [ ] `src/components/card/RewardsList.tsx` — Ödüller listesi
- [ ] `src/components/card/VisitHistory.tsx` — Ziyaret geçmişi
- [ ] `src/components/card/OTPModal.tsx` — OTP giriş modalı
- [ ] `src/app/card/[slug]/page.tsx` — Ana kart sayfası

### ADIM 7 — API Routes (Tümü)
- [ ] `src/app/api/auth/send-otp/route.ts`
- [ ] `src/app/api/auth/verify-otp/route.ts`
- [ ] `src/app/api/cafe/route.ts` (GET + PATCH)
- [ ] `src/app/api/cafe/logo/route.ts` (POST)
- [ ] `src/app/api/customers/route.ts` (GET)
- [ ] `src/app/api/customers/[id]/route.ts` (GET + PATCH)
- [ ] `src/app/api/stamps/request/route.ts` (POST)
- [ ] `src/app/api/stamps/approve/route.ts` (POST)
- [ ] `src/app/api/rewards/redeem/route.ts` (POST)
- [ ] `src/app/api/campaigns/route.ts` (GET + POST)
- [ ] `src/app/api/analytics/summary/route.ts` (GET)
- [ ] `src/app/api/notifications/send/route.ts` (POST)

### ADIM 8 — Custom Hooks
- [ ] `src/hooks/useRealtimeStamps.ts` — Supabase Realtime
- [ ] `src/hooks/useCustomers.ts`
- [ ] `src/hooks/useCafe.ts`

### ADIM 9 — Dashboard
- [ ] `src/components/dashboard/Sidebar.tsx`
- [ ] `src/components/dashboard/Header.tsx`
- [ ] `src/components/dashboard/StatsCard.tsx`
- [ ] `src/components/dashboard/StampApprovalCard.tsx`
- [ ] `src/components/dashboard/CustomerTable.tsx`
- [ ] `src/components/dashboard/CustomerTag.tsx`
- [ ] `src/components/dashboard/CampaignCard.tsx`
- [ ] `src/components/dashboard/AnalyticsChart.tsx`
- [ ] `src/app/(dashboard)/layout.tsx`
- [ ] `src/app/(dashboard)/dashboard/page.tsx`
- [ ] `src/app/(dashboard)/customers/page.tsx`
- [ ] `src/app/(dashboard)/customers/[id]/page.tsx`
- [ ] `src/app/(dashboard)/campaigns/page.tsx`
- [ ] `src/app/(dashboard)/analytics/page.tsx`
- [ ] `src/app/(dashboard)/settings/page.tsx`

### ADIM 10 — Onboarding (İlk Kafe Kurulumu)
- [ ] `src/app/(dashboard)/onboarding/page.tsx`

### ADIM 11 — PWA
- [ ] `public/manifest.json`
- [ ] PWA icons

### ADIM 12 — Final Kontrol
- [ ] `npm run build` hatasız geçmeli
- [ ] TypeScript strict hatası olmamalı
- [ ] Tüm sayfalar responsive olmalı

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
| ... | ... | ... |

---

*Bu dosyayı her geliştirme oturumundan önce oku, sonunda güncelle.*
