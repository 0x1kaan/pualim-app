import twilio from 'twilio'

interface SendWhatsAppParams {
  to: string
  message: string
}

interface WhatsAppResult {
  success: boolean
  messageId?: string
  error?: string
}

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token) throw new Error('Twilio credentials missing')
  return twilio(sid, token)
}

export async function sendWhatsApp({ to, message }: SendWhatsAppParams): Promise<WhatsAppResult> {
  const from = process.env.TWILIO_WHATSAPP_FROM ?? 'whatsapp:+14155238886'

  const phone = to.replace(/\D/g, '').replace(/^(0|90)/, '+90').replace(/^\+90/, '+90')
  const whatsappTo = `whatsapp:+90${phone.replace(/^\+90/, '')}`

  try {
    const client = getClient()
    const msg = await client.messages.create({
      from,
      to: whatsappTo,
      body: message,
    })
    return { success: true, messageId: msg.sid }
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return { success: false, error: 'WhatsApp mesajı gönderilemedi' }
  }
}

export function buildRewardWhatsApp(cafeName: string, rewardTitle: string): string {
  return `🎉 *${cafeName}*\n\nTebrikler! *"${rewardTitle}"* kazandınız!\n\nBir sonraki ziyaretinizde kasiyere gösterin ve ödülünüzü alın. ☕`
}

export function buildWinbackWhatsApp(cafeName: string, days: number): string {
  return `👋 *${cafeName}*\n\nSizi bir süredir göremedik! ${days} gün önce uğramıştınız.\n\nBu hafta gelin, özel kampanyalarımızdan yararlanın. ☕`
}

export function buildBirthdayWhatsApp(cafeName: string, customerName: string): string {
  return `🎂 *${cafeName}*\n\nDoğum günün kutlu olsun${customerName ? `, ${customerName}` : ''}! 🎉\n\nBugün kafemize uğra, sana özel bir sürprizimiz var! ☕`
}
