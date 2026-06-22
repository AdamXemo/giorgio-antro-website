'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CartItem } from '@/types/cart'

export interface CheckoutSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

interface ContextValue {
  summary: CheckoutSummary | null
  setSummary: (data: CheckoutSummary | null) => void
}

const CheckoutSummaryContext = createContext<ContextValue | null>(null)

export function CheckoutSummaryProvider({ children }: { children: ReactNode }) {
  const [summary, setSummaryState] = useState<CheckoutSummary | null>(null)
  const setSummary = useCallback((data: CheckoutSummary | null) => setSummaryState(data), [])

  return (
    <CheckoutSummaryContext.Provider value={{ summary, setSummary }}>
      {children}
    </CheckoutSummaryContext.Provider>
  )
}

export function useCheckoutSummary() {
  const ctx = useContext(CheckoutSummaryContext)
  if (!ctx) throw new Error('useCheckoutSummary must be used within CheckoutSummaryProvider')
  return ctx
}
