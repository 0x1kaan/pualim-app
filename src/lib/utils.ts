import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) return '+90' + cleaned.slice(1)
  if (cleaned.startsWith('90')) return '+' + cleaned
  if (cleaned.startsWith('+90')) return cleaned
  return '+90' + cleaned
}

export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '').replace(/^(0|90|\+90)/, '')
  if (cleaned.length < 10) return phone
  return cleaned.slice(0, 3) + ' *** ** ' + cleaned.slice(-2)
}

export function formatDate(date: string | Date | null, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date | null): string {
  if (!date) return '-'
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'az önce'
  if (minutes < 60) return `${minutes} dk önce`
  if (hours < 24) return `${hours} sa önce`
  if (days < 7) return `${days} gün önce`
  return formatDate(date)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const TAG_LABELS: Record<string, string> = {
  vip: 'VIP',
  loyal: 'Sadık',
  new: 'Yeni',
  at_risk: 'Risk',
  lost: 'Kayıp',
}

export const TAG_COLORS: Record<string, string> = {
  vip: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  loyal: 'text-green-400 bg-green-400/10 border-green-400/20',
  new: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  at_risk: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  lost: 'text-red-400 bg-red-400/10 border-red-400/20',
}
