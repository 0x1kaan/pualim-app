import { z } from 'zod'

export const cafeCreateSchema = z.object({
  name: z.string().min(2, 'Kafe adı en az 2 karakter olmalı').max(80),
  slug: z
    .string()
    .min(2, 'URL en az 2 karakter olmalı')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire kullanılabilir'),
  description: z.string().max(300).optional(),
  primary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Geçerli bir renk kodu girin')
    .default('#6366F1'),
  stamps_required: z.number().int().min(5).max(50).default(10),
  reward_title: z.string().min(2).max(100).default('Ücretsiz İçecek'),
  reward_description: z.string().max(200).optional(),
  address: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  instagram: z.string().max(50).optional(),
  whatsapp_enabled: z.boolean().default(false),
  sms_enabled: z.boolean().default(true),
  email_enabled: z.boolean().default(true),
})

export const cafeUpdateSchema = cafeCreateSchema.partial()

export type CafeCreateInput = z.infer<typeof cafeCreateSchema>
export type CafeUpdateInput = z.infer<typeof cafeUpdateSchema>
