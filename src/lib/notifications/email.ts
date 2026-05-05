import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@pualim.today'

interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendWelcomeEmail(to: string, cafeName: string): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: `Pualım <${FROM}>`,
      to,
      subject: `${cafeName} — Pualım'a hoş geldiniz!`,
      html: `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fbf7f0;">
          <h1 style="color: #2d5016; font-size: 28px; margin-bottom: 16px;">Hoş Geldiniz! ☕</h1>
          <p style="color: #2c1810; font-size: 16px; line-height: 1.6;">
            <strong>${cafeName}</strong> için Pualım hesabınız hazır.
          </p>
          <p style="color: #6b3a2a; font-size: 15px; line-height: 1.6;">
            Artık müşterilerinize dijital sadakat kartı sunabilir, puan ve ödül sisteminizi yönetebilirsiniz.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display: inline-block; margin-top: 24px; padding: 14px 28px; background: #2d5016; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Panele Git
          </a>
          <p style="color: #6b3a2a; font-size: 13px; margin-top: 40px;">
            Pualım — Müşterilerinizi sadık müşterilere dönüştürün.
          </p>
        </div>
      `,
    })

    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error: 'Email gönderilemedi' }
  }
}

export async function sendWeeklySummaryEmail(
  to: string,
  cafeName: string,
  stats: { newCustomers: number; totalStamps: number; rewardsEarned: number }
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: `Pualım <${FROM}>`,
      to,
      subject: `${cafeName} — Bu haftanın özeti`,
      html: `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #fbf7f0;">
          <h1 style="color: #2d5016; font-size: 24px;">Bu Haftanın Özeti ☕</h1>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 24px 0;">
            <div style="background: white; padding: 20px; border-radius: 12px; text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: #2d5016;">${stats.newCustomers}</div>
              <div style="color: #6b3a2a; font-size: 13px;">Yeni Müşteri</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: #2d5016;">${stats.totalStamps}</div>
              <div style="color: #6b3a2a; font-size: 13px;">Verilen Puan</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: #e8a045;">${stats.rewardsEarned}</div>
              <div style="color: #6b3a2a; font-size: 13px;">Kazanılan Ödül</div>
            </div>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/analytics"
             style="display: inline-block; margin-top: 8px; padding: 14px 28px; background: #2d5016; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Detaylı Analitik
          </a>
        </div>
      `,
    })

    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error: 'Email gönderilemedi' }
  }
}
