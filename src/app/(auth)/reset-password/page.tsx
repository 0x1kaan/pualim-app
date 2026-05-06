'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Coffee, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const PASSWORD_REQS = [
  { label: 'En az 8 karakter', test: (p: string) => p.length >= 8 },
  { label: 'Büyük harf içerir', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Rakam içerir', test: (p: string) => /\d/.test(p) },
]

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const passwordStrong = PASSWORD_REQS.every((r) => r.test(password))
  const passwordsMatch = password.length > 0 && password === confirmPassword

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordStrong) {
      toast.error('Şifre gereksinimlerini karşılayın')
      return
    }
    if (!passwordsMatch) {
      toast.error('Şifreler eşleşmiyor')
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        toast.error('Şifre güncellenemedi. Bağlantı süresi dolmuş olabilir.')
        return
      }

      await supabase.auth.signOut()
      toast.success('Şifreniz güncellendi')
      router.replace('/login?password=updated')
      router.refresh()
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Coffee className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-heading text-2xl">Yeni şifre oluşturun</CardTitle>
        <CardDescription>
          Hesabınız için güçlü ve hatırlanabilir bir şifre belirleyin.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Yeni şifre</Label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
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

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Şifre tekrarı</Label>
            <Input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !passwordStrong || !passwordsMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Güncelleniyor...
              </>
            ) : (
              'Şifreyi güncelle'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
