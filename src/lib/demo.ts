import type { Cafe, Campaign, Customer, PendingStamp, Stamp } from '@/types/database'

export interface AnalyticsSummary {
  total_customers: number
  new_customers: number
  total_stamps: number
  today_stamps: number
  today_customers: number
  vip_count: number
  total_rewards: number
  redeemed_rewards: number
}

export interface DemoPendingStamp extends PendingStamp {
  customers: { name: string | null; phone: string } | null
}

export type CustomerStamp = Pick<Stamp, 'id' | 'approved_at' | 'multiplier'>

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export const demoCafe: Cafe = {
  id: 'demo-cafe',
  owner_id: 'demo-owner',
  name: 'Mola Roastery',
  slug: 'mola-roastery',
  description: 'Mahalle kahvesi, taze kavrum ve dijital sadakat deneyimi.',
  logo_url: null,
  primary_color: '#2d5016',
  stamps_required: 10,
  plan: 'pro',
  plan_expires_at: null,
  whatsapp_enabled: true,
  sms_enabled: false,
  email_enabled: true,
  reward_title: 'Ücretsiz Flat White',
  reward_description: '10 puanı tamamlayan müşterilere seçili sıcak içecek.',
  address: 'Moda Cad. No: 24, Kadıköy / İstanbul',
  phone: '+90 216 555 34 12',
  instagram: '@molaroastery',
  is_active: true,
  created_at: '2026-03-12T09:00:00.000Z',
  updated_at: '2026-05-06T08:30:00.000Z',
}

export const demoSummary: AnalyticsSummary = {
  total_customers: 7,
  new_customers: 2,
  total_stamps: 184,
  today_stamps: 18,
  today_customers: 9,
  vip_count: 1,
  total_rewards: 21,
  redeemed_rewards: 17,
}

export const demoCustomers: Customer[] = [
  {
    id: 'demo-customer-1',
    cafe_id: demoCafe.id,
    phone: '+90 532 111 22 33',
    name: 'Elif Yılmaz',
    birthday: '1995-08-14',
    total_stamps: 42,
    current_stamps: 8,
    visit_count: 18,
    tag: 'vip',
    last_visit_at: '2026-05-06T08:45:00.000Z',
    notes: 'Genelde yulaf sütlü flat white tercih ediyor.',
    whatsapp_consent: true,
    sms_consent: false,
    created_at: '2026-03-15T10:12:00.000Z',
    updated_at: '2026-05-06T08:45:00.000Z',
  },
  {
    id: 'demo-customer-2',
    cafe_id: demoCafe.id,
    phone: '+90 555 242 18 08',
    name: 'Mert Kaya',
    birthday: null,
    total_stamps: 27,
    current_stamps: 5,
    visit_count: 11,
    tag: 'loyal',
    last_visit_at: '2026-05-05T16:22:00.000Z',
    notes: null,
    whatsapp_consent: true,
    sms_consent: true,
    created_at: '2026-03-28T12:20:00.000Z',
    updated_at: '2026-05-05T16:22:00.000Z',
  },
  {
    id: 'demo-customer-3',
    cafe_id: demoCafe.id,
    phone: '+90 544 809 71 60',
    name: 'Derya Aksoy',
    birthday: '1992-12-03',
    total_stamps: 18,
    current_stamps: 2,
    visit_count: 8,
    tag: 'loyal',
    last_visit_at: '2026-05-04T13:05:00.000Z',
    notes: 'Öğle saatlerinde ekip arkadaşlarıyla geliyor.',
    whatsapp_consent: true,
    sms_consent: false,
    created_at: '2026-04-02T09:40:00.000Z',
    updated_at: '2026-05-04T13:05:00.000Z',
  },
  {
    id: 'demo-customer-4',
    cafe_id: demoCafe.id,
    phone: '+90 536 730 44 19',
    name: 'Can Arslan',
    birthday: null,
    total_stamps: 6,
    current_stamps: 6,
    visit_count: 3,
    tag: 'new',
    last_visit_at: '2026-05-06T07:55:00.000Z',
    notes: null,
    whatsapp_consent: false,
    sms_consent: true,
    created_at: '2026-05-01T11:30:00.000Z',
    updated_at: '2026-05-06T07:55:00.000Z',
  },
  {
    id: 'demo-customer-5',
    cafe_id: demoCafe.id,
    phone: '+90 533 455 90 41',
    name: 'Zeynep Demir',
    birthday: '1989-04-22',
    total_stamps: 4,
    current_stamps: 4,
    visit_count: 2,
    tag: 'new',
    last_visit_at: '2026-05-03T10:12:00.000Z',
    notes: null,
    whatsapp_consent: true,
    sms_consent: false,
    created_at: '2026-05-02T14:15:00.000Z',
    updated_at: '2026-05-03T10:12:00.000Z',
  },
  {
    id: 'demo-customer-6',
    cafe_id: demoCafe.id,
    phone: '+90 539 812 10 77',
    name: 'Burak Şen',
    birthday: null,
    total_stamps: 14,
    current_stamps: 1,
    visit_count: 6,
    tag: 'at_risk',
    last_visit_at: '2026-04-17T15:18:00.000Z',
    notes: 'Geri kazanım kampanyası için uygun.',
    whatsapp_consent: true,
    sms_consent: true,
    created_at: '2026-03-30T09:10:00.000Z',
    updated_at: '2026-04-17T15:18:00.000Z',
  },
  {
    id: 'demo-customer-7',
    cafe_id: demoCafe.id,
    phone: '+90 542 600 33 29',
    name: 'Selin Koç',
    birthday: '1990-01-19',
    total_stamps: 9,
    current_stamps: 9,
    visit_count: 4,
    tag: 'lost',
    last_visit_at: '2026-03-29T12:42:00.000Z',
    notes: null,
    whatsapp_consent: false,
    sms_consent: false,
    created_at: '2026-03-18T13:25:00.000Z',
    updated_at: '2026-03-29T12:42:00.000Z',
  },
]

export const demoCustomerStamps: Record<string, CustomerStamp[]> = {
  'demo-customer-1': [
    { id: 'stamp-1-1', approved_at: '2026-05-06T08:45:00.000Z', multiplier: 2 },
    { id: 'stamp-1-2', approved_at: '2026-05-03T09:15:00.000Z', multiplier: 1 },
    { id: 'stamp-1-3', approved_at: '2026-04-30T16:40:00.000Z', multiplier: 1 },
  ],
  'demo-customer-2': [
    { id: 'stamp-2-1', approved_at: '2026-05-05T16:22:00.000Z', multiplier: 1 },
    { id: 'stamp-2-2', approved_at: '2026-05-01T10:04:00.000Z', multiplier: 2 },
  ],
  'demo-customer-3': [
    { id: 'stamp-3-1', approved_at: '2026-05-04T13:05:00.000Z', multiplier: 1 },
    { id: 'stamp-3-2', approved_at: '2026-04-29T12:10:00.000Z', multiplier: 1 },
  ],
  'demo-customer-4': [
    { id: 'stamp-4-1', approved_at: '2026-05-06T07:55:00.000Z', multiplier: 2 },
  ],
  'demo-customer-5': [
    { id: 'stamp-5-1', approved_at: '2026-05-03T10:12:00.000Z', multiplier: 1 },
  ],
  'demo-customer-6': [
    { id: 'stamp-6-1', approved_at: '2026-04-17T15:18:00.000Z', multiplier: 1 },
  ],
  'demo-customer-7': [
    { id: 'stamp-7-1', approved_at: '2026-03-29T12:42:00.000Z', multiplier: 1 },
  ],
}

export const demoPendingStamps: DemoPendingStamp[] = [
  {
    id: 'demo-pending-1',
    cafe_id: demoCafe.id,
    customer_id: 'demo-customer-4',
    phone: '+90 536 730 44 19',
    status: 'pending',
    created_at: '2026-05-06T09:08:00.000Z',
    expires_at: '2026-05-06T09:18:00.000Z',
    customers: { name: 'Can Arslan', phone: '+90 536 730 44 19' },
  },
  {
    id: 'demo-pending-2',
    cafe_id: demoCafe.id,
    customer_id: 'demo-customer-1',
    phone: '+90 532 111 22 33',
    status: 'pending',
    created_at: '2026-05-06T08:58:00.000Z',
    expires_at: '2026-05-06T09:08:00.000Z',
    customers: { name: 'Elif Yılmaz', phone: '+90 532 111 22 33' },
  },
  {
    id: 'demo-pending-3',
    cafe_id: demoCafe.id,
    customer_id: null,
    phone: '+90 530 901 45 44',
    status: 'pending',
    created_at: '2026-05-06T08:49:00.000Z',
    expires_at: '2026-05-06T08:59:00.000Z',
    customers: null,
  },
]

export const demoCampaigns: Campaign[] = [
  {
    id: 'demo-campaign-1',
    cafe_id: demoCafe.id,
    name: 'Hafta İçi 2x Puan',
    description: 'Sabah 08:00-11:00 arası tüm kahvelerde çift puan.',
    starts_at: '2026-05-01T05:00:00.000Z',
    ends_at: '2026-05-31T20:59:00.000Z',
    active_days: [1, 2, 3, 4, 5],
    active_hours_start: 8,
    active_hours_end: 11,
    stamp_multiplier: 2,
    bonus_stamps: 0,
    is_active: true,
    created_at: '2026-04-28T10:00:00.000Z',
    updated_at: '2026-05-06T08:30:00.000Z',
  },
  {
    id: 'demo-campaign-2',
    cafe_id: demoCafe.id,
    name: 'Yeni Üye Bonusu',
    description: 'İlk ziyaretinde QR kartını oluşturan müşteriye +2 puan.',
    starts_at: '2026-05-04T05:00:00.000Z',
    ends_at: '2026-05-18T20:59:00.000Z',
    active_days: [0, 1, 2, 3, 4, 5, 6],
    active_hours_start: 8,
    active_hours_end: 22,
    stamp_multiplier: 1,
    bonus_stamps: 2,
    is_active: true,
    created_at: '2026-05-02T10:10:00.000Z',
    updated_at: '2026-05-06T08:30:00.000Z',
  },
  {
    id: 'demo-campaign-3',
    cafe_id: demoCafe.id,
    name: 'Doğum Günü Haftası',
    description: 'Doğum günü haftasında gelen sadık müşterilere +3 puan.',
    starts_at: '2026-05-12T05:00:00.000Z',
    ends_at: '2026-05-19T20:59:00.000Z',
    active_days: [1, 2, 3, 4, 5, 6],
    active_hours_start: 9,
    active_hours_end: 21,
    stamp_multiplier: 1,
    bonus_stamps: 3,
    is_active: false,
    created_at: '2026-05-05T12:20:00.000Z',
    updated_at: '2026-05-05T12:20:00.000Z',
  },
]

export const demoAnalyticsTrend = [
  { date: '2026-04-30', count: 14 },
  { date: '2026-05-01', count: 21 },
  { date: '2026-05-02', count: 18 },
  { date: '2026-05-03', count: 24 },
  { date: '2026-05-04', count: 19 },
  { date: '2026-05-05', count: 27 },
  { date: '2026-05-06', count: 18 },
]

export const demoTagCounts: Record<string, number> = {
  vip: 1,
  loyal: 2,
  new: 2,
  at_risk: 1,
  lost: 1,
}
