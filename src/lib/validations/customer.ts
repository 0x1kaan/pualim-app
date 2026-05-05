import { z } from 'zod'

export const customerCreateSchema = z.object({
  phone: z
    .string()
    .min(10, 'Geçerli bir telefon numarası girin')
    .regex(/^(\+90|0|90)?[5][0-9]{9}$/, 'Geçerli bir Türkiye cep numarası girin'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalı').max(80).optional(),
  birthday: z.string().optional(),
  whatsapp_consent: z.boolean().default(false),
  sms_consent: z.boolean().default(true),
})

export const customerUpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  birthday: z.string().optional(),
  notes: z.string().max(500).optional(),
  whatsapp_consent: z.boolean().optional(),
  sms_consent: z.boolean().optional(),
  tag: z.enum(['vip', 'loyal', 'new', 'at_risk', 'lost']).optional(),
})

export const otpRequestSchema = z.object({
  phone: z
    .string()
    .min(10, 'Geçerli bir telefon numarası girin')
    .regex(/^(\+90|0|90)?[5][0-9]{9}$/, 'Geçerli bir Türkiye cep numarası girin'),
  cafe_id: z.string().uuid(),
})

export const otpVerifySchema = z.object({
  phone: z.string().min(10),
  cafe_id: z.string().uuid(),
  code: z.string().length(6, 'OTP kodu 6 haneli olmalı'),
})

export type CustomerCreateInput = z.infer<typeof customerCreateSchema>
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>
export type OTPRequestInput = z.infer<typeof otpRequestSchema>
export type OTPVerifyInput = z.infer<typeof otpVerifySchema>
