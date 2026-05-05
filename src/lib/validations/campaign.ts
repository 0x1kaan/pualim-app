import { z } from 'zod'

export const campaignSchema = z.object({
  name: z.string().min(2, 'Kampanya adı en az 2 karakter olmalı').max(100),
  description: z.string().max(300).optional(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  active_days: z
    .array(z.number().int().min(0).max(6))
    .default([0, 1, 2, 3, 4, 5, 6]),
  active_hours_start: z.number().int().min(0).max(23).default(0),
  active_hours_end: z.number().int().min(0).max(23).default(23),
  stamp_multiplier: z.number().int().min(1).max(10).default(2),
  bonus_stamps: z.number().int().min(0).max(50).default(0),
  is_active: z.boolean().default(true),
}).refine(
  (data) => new Date(data.ends_at) > new Date(data.starts_at),
  { message: 'Bitiş tarihi başlangıç tarihinden sonra olmalı', path: ['ends_at'] }
)

export const campaignUpdateSchema = campaignSchema.partial()

export type CampaignInput = z.infer<typeof campaignSchema>
export type CampaignUpdateInput = z.infer<typeof campaignUpdateSchema>
