interface SendSMSParams {
  to: string
  message: string
}

interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendSMS({ to, message }: SendSMSParams): Promise<SMSResult> {
  const usercode = process.env.NETGSM_USERCODE
  const password = process.env.NETGSM_PASSWORD
  const msgheader = process.env.NETGSM_MSGHEADER ?? 'PUALIM'

  if (!usercode || !password) {
    console.error('Netgsm credentials missing')
    return { success: false, error: 'SMS konfigürasyonu eksik' }
  }

  const phone = to.replace(/\D/g, '').replace(/^(0|90|\+90)/, '')
  if (phone.length !== 10) {
    return { success: false, error: 'Geçersiz telefon numarası' }
  }

  const params = new URLSearchParams({
    usercode,
    password,
    gsmno: phone,
    message,
    msgheader,
    dil: 'TR',
  })

  try {
    const response = await fetch(
      `https://api.netgsm.com.tr/sms/send/get?${params.toString()}`,
      { method: 'GET', signal: AbortSignal.timeout(10000) }
    )

    const text = await response.text()
    const code = text.trim().split(' ')[0]

    if (code === '00' || code === '01' || code === '02') {
      return { success: true, messageId: text.trim() }
    }

    return { success: false, error: `Netgsm hata kodu: ${code}` }
  } catch (error) {
    console.error('SMS send error:', error)
    return { success: false, error: 'SMS gönderilemedi' }
  }
}

export function buildOTPMessage(code: string, cafeName: string): string {
  return `${cafeName} doğrulama kodunuz: ${code}. Kod 10 dakika geçerlidir.`
}

export function buildStampMessage(cafeName: string, currentStamps: number, required: number): string {
  return `${cafeName}: Puanınız onaylandı! ${currentStamps}/${required} puan. ${required - currentStamps} puan daha tamamladığınızda ödülünüzü kazanacaksınız.`
}

export function buildRewardMessage(cafeName: string, rewardTitle: string): string {
  return `Tebrikler! ${cafeName}'de "${rewardTitle}" kazandınız. Bir sonraki ziyaretinizde kullanabilirsiniz.`
}
