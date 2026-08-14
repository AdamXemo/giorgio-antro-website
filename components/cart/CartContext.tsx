'use client'

import { createContext, useContext, useState, useSyncExternalStore, ReactNode } from 'react'
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

/**
 * The cart lives in localStorage and is read through useSyncExternalStore
 * rather than mirrored into React state. That removes the mount-time
 * "rehydrate into state" effect (and the `hydrated` flag that had to guard the
 * persist effect against overwriting storage with the initial empty array),
 * and makes the cart follow changes made in other tabs.
 */

const EMPTY: CartItem[] = []
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : EMPTY
  } catch {
    // Missing, unreadable or corrupted storage — start empty.
    return EMPTY
  }
}

// useSyncExternalStore compares snapshots by identity, so the parsed array MUST
// be cached. Re-parsing on every call would hand back a new array each render
// and spin forever. This also keeps the cart working when localStorage writes
// are rejected: the in-memory value is what renders either way.
let snapshot: CartItem[] | null = null

function getSnapshot(): CartItem[] {
  if (snapshot === null) snapshot = readStorage()
  return snapshot
}

/** No localStorage on the server; renders an empty cart so hydration matches. */
function getServerSnapshot(): CartItem[] {
  return EMPTY
}

function subscribe(onStoreChange: () => void) {
  // 'storage' only fires for changes made in *other* tabs; same-tab writes are
  // announced by emit() from updateCart.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== CART_STORAGE_KEY) return
    snapshot = readStorage()
    onStoreChange()
  }
  listeners.add(onStoreChange)
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener('storage', onStorage)
  }
}

function updateCart(updater: (prev: CartItem[]) => CartItem[]) {
  snapshot = updater(getSnapshot())
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // ignore storage errors (e.g. private mode quota)
  }
  emit()
}

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (item: CartItem) => {
    updateCart(prevCart => {
      const existing = prevCart.find(i => i.id === item.id && i.size === item.size)
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
    updateCart(prevCart => prevCart.filter(item => !(item.id === id && item.size === size)))
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size)
      return
    }
    updateCart(prevCart =>
      prevCart.map(item => (item.id === id && item.size === size ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => updateCart(() => EMPTY)

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
