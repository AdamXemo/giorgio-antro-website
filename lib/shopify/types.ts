export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export interface ShopifySelectedOption {
  name: string
  value: string
}

export interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyMoney
  selectedOptions: ShopifySelectedOption[]
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  priceRange: {
    minVariantPrice: ShopifyMoney
    maxVariantPrice: ShopifyMoney
  }
  images: ShopifyImage[]
  variants: ShopifyVariant[]
}

export interface ShopifyCartLineMerchandise {
  id: string
  title: string
  product: {
    id: string
    title: string
    handle: string
  }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  cost: {
    totalAmount: ShopifyMoney
  }
  merchandise: ShopifyCartLineMerchandise
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: ShopifyCartLine[]
  cost: {
    totalAmount: ShopifyMoney
    subtotalAmount: ShopifyMoney
  }
}

export interface ShopifyUserError {
  field: string[]
  message: string
}
