// Supports both NEXT_PUBLIC_ (client-side) and server-only env var names.
// Storefront API tokens are designed to be public — using NEXT_PUBLIC_ is intentional.
// TODO (human): Decide whether Shopify is the source of truth for catalog and pricing.
// The live checkout flow currently validates against the static product catalog instead.
const domain =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ??
  process.env.SHOPIFY_STORE_DOMAIN

const token =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ??
  process.env.SHOPIFY_STOREFRONT_TOKEN

const API_VERSION = '2024-10'

function getEndpoint(): string {
  if (!domain) {
    throw new Error(
      'Missing Shopify store domain. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN in your environment.'
    )
  }
  return `https://${domain}/api/${API_VERSION}/graphql.json`
}

function getToken(): string {
  if (!token) {
    throw new Error(
      'Missing Shopify Storefront token. Set NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in your environment.'
    )
  }
  return token
}

export interface StorefrontFetchOptions {
  /** Fetch cache strategy. Defaults to 'no-store' for always-fresh data. */
  cache?: RequestCache
  /** Next.js revalidation tags for on-demand cache invalidation. */
  tags?: string[]
}

export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: StorefrontFetchOptions = {}
): Promise<T> {
  const { cache = 'no-store', tags } = options

  const res = await fetch(getEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': getToken(),
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags?.length ? { next: { tags } } : {}),
  })

  if (!res.ok) {
    throw new Error(
      `Shopify Storefront API request failed: ${res.status} ${res.statusText}`
    )
  }

  const json: { data?: T; errors?: { message: string }[] } = await res.json()

  if (json.errors?.length) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Shopify] GraphQL errors:', json.errors)
    }
    throw new Error(json.errors[0].message)
  }

  return json.data as T
}
