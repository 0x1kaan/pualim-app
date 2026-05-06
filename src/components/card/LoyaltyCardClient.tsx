'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Gift, History, Plus, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StampGrid } from './StampGrid'
import { RewardsList } from './RewardsList'
import { VisitHistory } from './VisitHistory'

interface Cafe {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string
  stamps_required: number
  reward_title: string
  reward_description: string | null
}

interface CustomerData {
  id: string
  name: string | null
  current_stamps: number
  total_stamps: number
  visit_count: number
  tag: string
}

type Screen = 'card' | 'phone' | 'otp' | 'requesting'

export function LoyaltyCardClient({ cafe }: { cafe: Cafe }) {
  const TOKEN_KEY = `pualim_token_${cafe.id}`
  const CUSTOMER_KEY = `pualim_customer_${cafe.id}`

  const [screen, setScreen] = useState<Screen>('card')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedCustomer = localStorage.getItem(CUSTOMER_KEY)
    if (savedToken && savedCustomer) {
      setToken(savedToken)
      setCustomer(JSON.parse(savedCustomer))
    }
  }, [TOKEN_KEY, CUSTOMER_KEY])

  async function handleSendOTP() {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      toast.error('Geçerli bir telefon numarası girin')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, cafe_id: cafe.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'SMS gönderilemedi')
        return
      }
      // Geliştirme ortamında kodu göster
      if (data.debug_code) {
        toast.info(`Test kodu: ${data.debug_code}`)
      }
      toast.success('Doğrulama kodu gönderildi')
      setScreen('otp')
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOTP() {
    if (otp.length !== 6) {
      toast.error('6 haneli kodu girin')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, cafe_id: cafe.id, code: otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Kod hatalı')
        return
      }
      localStorage.setItem(TOKEN_KEY, data.token)

      // Müşteri bilgisini çek
      const customerRes = await fetch(`/api/card/${cafe.slug}/customer`, {
        headers: { Authorization: `Bearer ${data.token}` },
      })
      const customerData = await customerRes.json()
      if (customerData.customer) {
        setCustomer(customerData.customer)
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customerData.customer))
      }

      setToken(data.token)
      setScreen('card')
      toast.success('Hoş geldiniz!')
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRequestStamp() {
    if (!token) {
      setScreen('phone')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/stamps/request', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(CUSTOMER_KEY)
          setToken(null)
          setCustomer(null)
          setScreen('phone')
        } else {
          toast.error(data.error ?? 'Talep gönderilemedi')
        }
        return
      }
      setScreen('requesting')
      setRequestSuccess(true)
      toast.success('Puan talebiniz gönderildi!')
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(CUSTOMER_KEY)
    setToken(null)
    setCustomer(null)
    setPhone('')
    setOtp('')
    setScreen('card')
    toast.info('Çıkış yapıldı')
  }

  const primaryColor = cafe.primary_color ?? '#2d5016'

  return (
    <div
      className="min-h-screen flex flex-col items-center pb-safe"
      style={{ background: `${primaryColor}08` }}
    >
      {/* Header */}
      <div
        className="w-full py-6 px-4 flex flex-col items-center text-white"
        style={{ background: primaryColor }}
      >
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
          {cafe.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cafe.logo_url} alt={cafe.name} className="w-12 h-12 object-cover rounded-full" />
          ) : (
            <Coffee className="h-8 w-8 text-white" />
          )}
        </div>
        <h1 className="text-xl font-heading font-bold">{cafe.name}</h1>
        <p className="text-white/70 text-sm mt-1">Sadakat Kartım</p>

        {customer && (
          <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
            <span>{customer.visit_count} ziyaret</span>
            <span>·</span>
            <span>{customer.total_stamps} toplam puan</span>
            <button onClick={logout} className="text-white/60 text-xs underline">
              Çıkış
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-md px-4 pt-6 flex-1">
        <AnimatePresence mode="wait">
          {/* Phone input screen */}
          {screen === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-heading font-bold text-lg text-foreground">Telefon Numaranız</h2>
                <p className="text-sm text-muted-foreground">SMS ile doğrulama kodu göndereceğiz</p>
              </div>
              <Input
                type="tel"
                placeholder="0532 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-lg h-12"
                autoFocus
              />
              <Button
                className="w-full h-12"
                onClick={handleSendOTP}
                disabled={isLoading}
                style={{ background: primaryColor }}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kod Gönder'}
              </Button>
              <button
                className="w-full text-sm text-muted-foreground"
                onClick={() => setScreen('card')}
              >
                İptal
              </button>
            </motion.div>
          )}

          {/* OTP screen */}
          {screen === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-heading font-bold text-lg">Doğrulama Kodu</h2>
                <p className="text-sm text-muted-foreground">
                  {phone} numarasına gönderilen 6 haneli kodu girin
                </p>
              </div>
              <Input
                type="number"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                className="text-2xl h-14 tracking-widest text-center"
                autoFocus
                maxLength={6}
              />
              <Button
                className="w-full h-12"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                style={{ background: primaryColor }}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Doğrula'}
              </Button>
              <button
                className="w-full text-sm text-muted-foreground"
                onClick={() => setScreen('phone')}
              >
                Tekrar gönder
              </button>
            </motion.div>
          )}

          {/* Requesting screen */}
          {screen === 'requesting' && requestSuccess && (
            <motion.div
              key="requesting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: 3, duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </motion.div>
              <h2 className="font-heading font-bold text-xl mb-2">Puan Talebiniz Gönderildi!</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Kasiyer onayladığında puanınız otomatik eklenecek.
              </p>
              <Button variant="outline" onClick={() => setScreen('card')}>
                Karta Dön
              </Button>
            </motion.div>
          )}

          {/* Main card screen */}
          {screen === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {customer ? (
                <Tabs defaultValue="card">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="card" className="flex-1 gap-1.5">
                      <Coffee className="h-3.5 w-3.5" />
                      Kartım
                    </TabsTrigger>
                    <TabsTrigger value="rewards" className="flex-1 gap-1.5">
                      <Gift className="h-3.5 w-3.5" />
                      Ödüllerim
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex-1 gap-1.5">
                      <History className="h-3.5 w-3.5" />
                      Geçmiş
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-6">
                    <StampGrid
                      current={customer.current_stamps}
                      required={cafe.stamps_required}
                      primaryColor={primaryColor}
                      rewardTitle={cafe.reward_title}
                    />
                    <Button
                      className="w-full h-14 text-base font-semibold gap-2"
                      onClick={handleRequestStamp}
                      disabled={isLoading}
                      style={{ background: primaryColor }}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          Puan İste
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="rewards">
                    <RewardsList customerId={customer.id} token={token!} cafeId={cafe.id} />
                  </TabsContent>

                  <TabsContent value="history">
                    <VisitHistory customerId={customer.id} token={token!} />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-6">
                  <StampGrid
                    current={0}
                    required={cafe.stamps_required}
                    primaryColor={primaryColor}
                    rewardTitle={cafe.reward_title}
                  />
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-4">
                      Puan kazanmak için giriş yapın
                    </p>
                    <Button
                      className="w-full h-14 text-base font-semibold gap-2"
                      onClick={() => setScreen('phone')}
                      style={{ background: primaryColor }}
                    >
                      <Plus className="h-5 w-5" />
                      Puan İste / Giriş Yap
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
