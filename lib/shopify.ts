const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!
const SHOPIFY_API_VERSION = '2024-10'
const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Shopify API request failed: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  return json.data as T
}

// ---------- Types ----------

export interface ShopifyVariant {
  id: string // GID: "gid://shopify/ProductVariant/..."
  title: string
  selectedOptions: { name: string; value: string }[]
  price: { amount: string; currencyCode: string }
  availableForSale: boolean
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  lines: {
    edges: {
      node: {
        id: string
        quantity: number
        merchandise: { id: string; title: string }
      }
    }[]
  }
}

// ---------- Queries / Mutations ----------

const PRODUCT_VARIANTS_QUERY = `
  query ProductVariants($handle: String!) {
    product(handle: $handle) {
      id
      title
      variants(first: 30) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions { name value }
            price { amount currencyCode }
          }
        }
      }
    }
  }
`

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`

// ---------- Public API ----------

/** Fetch all variants for a Shopify product by its handle (slug). */
export async function getProductVariants(handle: string): Promise<ShopifyVariant[]> {
  const data = await storefrontFetch<{
    product: {
      variants: { edges: { node: ShopifyVariant }[] }
    } | null
  }>(PRODUCT_VARIANTS_QUERY, { handle })

  if (!data.product) {
    throw new Error(`Shopify product not found for handle: "${handle}". Make sure the product exists in your Shopify store.`)
  }

  return data.product.variants.edges.map((e) => e.node)
}

/** Create a Shopify cart from merchandiseId/quantity pairs and return the hosted checkout URL. */
export async function createShopifyCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<{ checkoutUrl: string; cartId: string }> {
  const data = await storefrontFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null
      userErrors: { field: string[]; message: string }[]
    }
  }>(CART_CREATE_MUTATION, { lines })

  const { cart, userErrors } = data.cartCreate

  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(', '))
  }
  if (!cart) {
    throw new Error('Shopify returned no cart after creation.')
  }

  return { checkoutUrl: cart.checkoutUrl, cartId: cart.id }
}
