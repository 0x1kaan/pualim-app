'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Coffee, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const PASSWORD_REQS = [
  { label: 'En az 8 karakter', test: (p: string) => p.length >= 8 },
  { label: 'Büyük harf içerir', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Rakam içerir', test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const passwordStrong = PASSWORD_REQS.every((r) => r.test(password))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Tüm alanları doldurun')
      return
    }
    if (!passwordStrong) {
      toast.error('Şifre gereksinimlerini karşılayın')
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Bu e-posta adresi zaten kayıtlı')
        } else {
          toast.error('Kayıt olunamadı. Tekrar deneyin.')
        }
        return
      }

      setEmailSent(true)
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <Card className="border border-border shadow-sm text-center">
        <CardContent className="pt-8 pb-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-heading font-bold mb-2">E-postanızı kontrol edin</h2>
          <p className="text-muted-foreground text-sm mb-6">
            <strong>{email}</strong> adresine doğrulama linki gönderdik.
            Linke tıklayarak hesabınızı aktive edin.
          </p>
          <Link
            href="/login"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition hover:bg-muted"
          >
            Giriş Yap
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Coffee className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-heading">Ücretsiz Başlayın</CardTitle>
        <CardDescription>Kafe bilgilerini sonra gireceksiniz</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="kafe@ornek.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                {PASSWORD_REQS.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <Check
                      className={`h-3 w-3 ${req.test(password) ? 'text-green-500' : 'text-muted-foreground'}`}
                    />
                    <span className={req.test(password) ? 'text-foreground' : 'text-muted-foreground'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !passwordStrong}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Hesap oluşturuluyor...
              </>
            ) : (
              'Ücretsiz Kaydol'
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Kaydolarak{' '}
          <Link href="/gizlilik" className="underline hover:text-foreground">Gizlilik Politikası</Link>
          {' '}ve{' '}
          <Link href="/kosullar" className="underline hover:text-foreground">Kullanım Koşulları</Link>
          &apos;nı kabul edersiniz.
        </p>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Hesabınız var mı?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Giriş yapın
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
