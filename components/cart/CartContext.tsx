'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { CartItem } from '@/types/cart'

export type { CartItem }

interface CartContextType {
  cart: CartItem[]
  /** Total number of individual units across all line items */
  itemCount: number
  /** Sum of price × quantity for all items */
  cartTotal: number
  isCartOpen: boolean
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const CART_STORAGE_KEY = 'antro_cart'

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as CartItem).id === 'string' &&
    typeof (value as CartItem).name === 'string' &&
    typeof (value as CartItem).price === 'number' &&
    typeof (value as CartItem).size === 'string' &&
    typeof (value as CartItem).quantity === 'number' &&
    typeof (value as CartItem).image === 'string'
  )
}

function parseStoredCart(value: string | null): CartItem[] {
  if (!value) return []

  const parsed: unknown = JSON.parse(value)
  if (!Array.isArray(parsed) || !parsed.every(isCartItem)) {
    throw new Error('Invalid cart storage payload')
  }

  return parsed
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(parseStoredCart(localStorage.getItem(CART_STORAGE_KEY)))
    } catch {
      // ignore corrupted storage
      localStorage.removeItem(CART_STORAGE_KEY)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return

      try {
        setCart(parseStoredCart(event.newValue))
      } catch {
        setCart([])
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [hydrated])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // ignore storage errors (e.g. private mode quota)
    }
  }, [cart, hydrated])

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(
        i => i.id === item.id && i.size === item.size
      )
      if (existing) {
        return prevCart.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prevCart, item]
    })
  }

  const removeFromCart = (id: string, size: string) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.size === size)))
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        cartTotal,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
