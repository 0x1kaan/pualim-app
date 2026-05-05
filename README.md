# Pualım App

Türk kafeler için QR tabanlı, uygulama indirmeden çalışan dijital sadakat platformu.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Supabase Auth, Postgres, Realtime ve Storage
- shadcn/base-ui bileşenleri

## Kurulum

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Geliştirme sunucusu varsayılan olarak `http://localhost:3000` adresinde açılır.

## Gerekli Ortam Değişkenleri

Minimum yerel geliştirme için:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Bildirim entegrasyonları ilerleyen sprintlerde bu değişkenleri kullanacak:

```bash
NETGSM_USERCODE=
NETGSM_PASSWORD=
NETGSM_MSGHEADER=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

## Komutlar

```bash
npm run lint
npm run build
npm run start
```

## Mevcut Durum

- Landing page Pualım marka diliyle hazırlandı.
- SEO metadata, robots, sitemap ve OG image route eklendi.
- Supabase migration dosyaları ve TypeScript database tipleri mevcut.
- Bir sonraki ürün adımı auth, onboarding ve kafe oluşturma akışını bağlamak.
