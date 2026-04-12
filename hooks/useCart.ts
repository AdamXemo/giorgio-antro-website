'use client'

// Re-export from CartContext so callers can import from either location.
// Prefer this import path for new code: import { useCart } from '@/hooks/useCart'
export { useCart } from '@/components/cart/CartContext'
export type { CartItem } from '@/components/cart/CartContext'
