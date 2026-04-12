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

    fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setInitError(data.error ?? 'Failed to initialize checkout.')
      })
      .catch(() => setInitError('Failed to initialize checkout. Please try again.'))
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

  return { clientSecret, mounted, initError }
}
