export const APP_NAME = 'Pualım'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://pualim.today'
export const APP_DESCRIPTION = 'Müşterilerinizi sadık müşterilere dönüştürün. QR tabanlı dijital sadakat kartı sistemi.'

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 0,
    currency: '₺',
    period: 'ay',
    customer_limit: 100,
    features: [
      '100 müşteriye kadar',
      'QR sadakat kartı',
      'Puan ve ödül sistemi',
      'Temel analitik',
      'SMS bildirimleri',
    ],
    cta: 'Ücretsiz Başla',
  },
  pro: {
    name: 'Pro',
    price: 299,
    currency: '₺',
    period: 'ay',
    customer_limit: null,
    features: [
      'Sınırsız müşteri',
      'WhatsApp bildirimleri',
      'Kampanya yönetimi',
      'Gelişmiş analitik',
      'Müşteri segmentasyonu',
      'Öncelikli destek',
    ],
    cta: 'Pro\'ya Geç',
    badge: 'En Popüler',
  },
  chain: {
    name: 'Chain',
    price: 799,
    currency: '₺',
    period: 'ay',
    customer_limit: null,
    features: [
      'Pro\'nun tüm özellikleri',
      '5 lokasyona kadar',
      'API erişimi',
      'Özel entegrasyonlar',
      'Dedicated destek',
    ],
    cta: 'İletişime Geç',
  },
} as const

export const OTP_EXPIRE_MINUTES = 10
export const PENDING_STAMP_EXPIRE_MINUTES = 5
export const REWARD_EXPIRE_DAYS = 90

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Pazar' },
  { value: 1, label: 'Pazartesi' },
  { value: 2, label: 'Salı' },
  { value: 3, label: 'Çarşamba' },
  { value: 4, label: 'Perşembe' },
  { value: 5, label: 'Cuma' },
  { value: 6, label: 'Cumartesi' },
]
