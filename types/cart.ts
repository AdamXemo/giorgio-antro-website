export interface CartItem {
  id: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
  /** Shopify variant GID — required for Shopify cart sync, optional for local-only use */
  variantId?: string
}
