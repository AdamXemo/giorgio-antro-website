import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { CartItem } from '@/types/cart'

interface UseCheckoutSessionReturn {
  clientSecret: string | null
  mounted: boolean
  initError: string | null
}

export function useCheckoutSession(cart: CartItem[]): UseCheckoutSessionReturn {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (cart.length === 0) {
      router.replace('/cart')
      return
    }

    const controller = new AbortController()
    setInitError(null)
    setClientSecret(null)

    fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json()
        return { ok: response.ok, data }
      })
      .then(({ ok, data }) => {
        if (!ok) {
          setInitError(data.error ?? 'Failed to initialize checkout.')
          return
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
          return
        }

        setInitError(data.error ?? 'Failed to initialize checkout.')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setInitError('Failed to initialize checkout. Please try again.')
      })

    return () => controller.abort()
  }, [cart, mounted, router])

  return { clientSecret, mounted, initError }
}
