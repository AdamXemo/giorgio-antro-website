import { storefrontFetch } from './client'
import type { ShopifyProduct, ShopifyCart, ShopifyUserError } from './types'
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCT_RECOMMENDATIONS,
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART,
  REMOVE_FROM_CART,
  GET_CART,
} from './queries'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Shopify]', ...args)
  }
}

function throwOnUserErrors(errors: ShopifyUserError[], context: string) {
  if (errors.length > 0) {
    throw new Error(`${context}: ${errors.map((e) => e.message).join(', ')}`)
  }
}

/** Normalize paginated Shopify edge/node lists into flat arrays. */
function edges<T>(connection: { edges: { node: T }[] }): T[] {
  return connection.edges.map((e) => e.node)
}

// ─── Raw response shapes (internal) ──────────────────────────────────────────

interface RawProduct {
  id: string
  title: string
  handle: string
  description: string
  priceRange: ShopifyProduct['priceRange']
  images: { edges: { node: ShopifyProduct['images'][number] }[] }
  variants: { edges: { node: ShopifyProduct['variants'][number] }[] }
}

interface RawCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: { edges: { node: ShopifyCart['lines'][number] }[] }
  cost: ShopifyCart['cost']
}

function normalizeProduct(raw: RawProduct): ShopifyProduct {
  return {
    ...raw,
    images: edges(raw.images),
    variants: edges(raw.variants),
  }
}

function normalizeCart(raw: RawCart): ShopifyCart {
  return {
    ...raw,
    lines: edges(raw.lines),
  }
}

// ─── Product functions ────────────────────────────────────────────────────────

export async function getAllProducts(first = 20): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontFetch<{
      products: { edges: { node: RawProduct }[] }
    }>(GET_ALL_PRODUCTS, { first })

    const products = edges(data.products).map(normalizeProduct)
    devLog(`getAllProducts: fetched ${products.length} products`)
    return products
  } catch (error) {
    devLog('getAllProducts error:', error)
    throw error
  }
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct> {
  try {
    const data = await storefrontFetch<{ product: RawProduct | null }>(
      GET_PRODUCT_BY_HANDLE,
      { handle }
    )

    if (!data.product) {
      throw new Error(`Product not found for handle: "${handle}"`)
    }

    const product = normalizeProduct(data.product)
    devLog(`getProductByHandle: fetched "${product.title}"`)
    return product
  } catch (error) {
    devLog('getProductByHandle error:', error)
    throw error
  }
}

export async function getProductRecommendations(
  productId: string
): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontFetch<{
      productRecommendations: RawProduct[]
    }>(GET_PRODUCT_RECOMMENDATIONS, { productId })

    const products = (data.productRecommendations ?? []).map(normalizeProduct)
    devLog(`getProductRecommendations: fetched ${products.length} recommendations`)
    return products
  } catch (error) {
    devLog('getProductRecommendations error:', error)
    throw error
  }
}

// ─── Cart functions ───────────────────────────────────────────────────────────

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = []
): Promise<ShopifyCart> {
  try {
    const data = await storefrontFetch<{
      cartCreate: { cart: RawCart | null; userErrors: ShopifyUserError[] }
    }>(CREATE_CART, { lines })

    throwOnUserErrors(data.cartCreate.userErrors, 'createCart')

    if (!data.cartCreate.cart) {
      throw new Error('createCart: Shopify returned no cart')
    }

    const cart = normalizeCart(data.cartCreate.cart)
    devLog(`createCart: created cart ${cart.id}`)
    return cart
  } catch (error) {
    devLog('createCart error:', error)
    throw error
  }
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<ShopifyCart> {
  try {
    const data = await storefrontFetch<{
      cartLinesAdd: { cart: RawCart | null; userErrors: ShopifyUserError[] }
    }>(ADD_TO_CART, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    })

    throwOnUserErrors(data.cartLinesAdd.userErrors, 'addToCart')

    if (!data.cartLinesAdd.cart) {
      throw new Error('addToCart: Shopify returned no cart')
    }

    const cart = normalizeCart(data.cartLinesAdd.cart)
    devLog(`addToCart: cart now has ${cart.totalQuantity} item(s)`)
    return cart
  } catch (error) {
    devLog('addToCart error:', error)
    throw error
  }
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  try {
    const data = await storefrontFetch<{
      cartLinesUpdate: { cart: RawCart | null; userErrors: ShopifyUserError[] }
    }>(UPDATE_CART, {
      cartId,
      lines: [{ id: lineId, quantity }],
    })

    throwOnUserErrors(data.cartLinesUpdate.userErrors, 'updateCartLine')

    if (!data.cartLinesUpdate.cart) {
      throw new Error('updateCartLine: Shopify returned no cart')
    }

    return normalizeCart(data.cartLinesUpdate.cart)
  } catch (error) {
    devLog('updateCartLine error:', error)
    throw error
  }
}

export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  try {
    const data = await storefrontFetch<{
      cartLinesRemove: { cart: RawCart | null; userErrors: ShopifyUserError[] }
    }>(REMOVE_FROM_CART, {
      cartId,
      lineIds: [lineId],
    })

    throwOnUserErrors(data.cartLinesRemove.userErrors, 'removeFromCart')

    if (!data.cartLinesRemove.cart) {
      throw new Error('removeFromCart: Shopify returned no cart')
    }

    return normalizeCart(data.cartLinesRemove.cart)
  } catch (error) {
    devLog('removeFromCart error:', error)
    throw error
  }
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const data = await storefrontFetch<{ cart: RawCart | null }>(GET_CART, { cartId })

    if (!data.cart) {
      devLog(`getCart: cart ${cartId} not found (may have expired)`)
      return null
    }

    return normalizeCart(data.cart)
  } catch (error) {
    devLog('getCart error:', error)
    throw error
  }
}
