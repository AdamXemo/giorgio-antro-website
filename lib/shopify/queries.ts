// ─── Fragment definitions ─────────────────────────────────────────────────────
// Each constant defines ONLY itself — no nesting of fragment strings.
// Queries/mutations enumerate every fragment definition they depend on.

const MONEY_FRAGMENT = `
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`

const IMAGE_FRAGMENT = `
  fragment Image on Image {
    url
    altText
    width
    height
  }
`

// References Money and Image by name — does NOT embed their definitions
const VARIANT_FRAGMENT = `
  fragment Variant on ProductVariant {
    id
    title
    availableForSale
    price { ...Money }
    selectedOptions { name value }
  }
`

// References Money, Image, Variant by name — does NOT embed their definitions
const PRODUCT_FRAGMENT = `
  fragment Product on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice { ...Money }
      maxVariantPrice { ...Money }
    }
    images(first: 3) {
      edges { node { ...Image } }
    }
    variants(first: 30) {
      edges { node { ...Variant } }
    }
  }
`

// References Money by name — does NOT embed its definition
const CART_FRAGMENT = `
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { ...Money }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                title
                handle
              }
            }
          }
        }
      }
    }
    cost {
      totalAmount { ...Money }
      subtotalAmount { ...Money }
    }
  }
`

// ─── Product Queries ──────────────────────────────────────────────────────────

export const GET_ALL_PRODUCTS = `
  query GetAllProducts($first: Int = 20) {
    products(first: $first) {
      edges {
        node { ...Product }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice { ...Money }
        maxVariantPrice { ...Money }
      }
      images(first: 10) {
        edges { node { ...Image } }
      }
      variants(first: 30) {
        edges { node { ...Variant } }
      }
      options {
        id
        name
        values
      }
    }
  }
  ${VARIANT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

export const GET_PRODUCT_RECOMMENDATIONS = `
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

// ─── Cart Mutations ───────────────────────────────────────────────────────────

export const CREATE_CART = `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...Cart }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
  ${MONEY_FRAGMENT}
`

export const ADD_TO_CART = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...Cart }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
  ${MONEY_FRAGMENT}
`

export const UPDATE_CART = `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...Cart }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
  ${MONEY_FRAGMENT}
`

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...Cart }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
  ${MONEY_FRAGMENT}
`

// ─── Cart Query ───────────────────────────────────────────────────────────────

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...Cart
    }
  }
  ${CART_FRAGMENT}
  ${MONEY_FRAGMENT}
`
