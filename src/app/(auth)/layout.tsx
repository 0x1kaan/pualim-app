import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Giriş Yap',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-10 flex items-center gap-2">
        <span className="text-3xl font-heading font-bold text-primary">Pualım</span>
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
      <p className="mt-8 text-sm text-muted-foreground text-center">
        © 2026 Pualım · Tüm hakları saklıdır
      </p>
    </div>
  )
}
