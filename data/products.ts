export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  sizes: string[]
  category: string
  inStock: boolean
  features: string[]
  shippingInfo: string
  /** Must match the product handle (slug) in your Shopify store. */
  shopifyHandle: string
}

// Main product - ANTRO Classic Hoodie
export const mainProduct: Product = {
  id: 'antro-classic-hoodie',
  shopifyHandle: 'sailor-hooded-zip-jacket',
  name: 'ANTRO Classic Hoodie',
  price: 120,
  description:
    'A modern adaptation of the zip hoodie — the ANTRO Classic is crafted from 100% cotton with a fluid, relaxed unisex silhouette. The hood is one large integrated pattern piece, creating a clean architectural line. Lightweight yet structured, waterproof and wrinkle resistant. A versatile designer piece that reflects understated luxury and contemporary elegance.',
  images: [
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
  ],
  sizes: ['ONE SIZE'],
  category: 'Coats & Jackets',
  inStock: true,
  features: [
    '100% cotton — premium heavyweight fabric',
    'One size — relaxed unisex silhouette',
    'Integrated architectural hood (one pattern piece)',
    'Waterproof finish',
    'Lightweight & wrinkle resistant',
    'Front pockets',
    'Long sleeves with clean cuffs',
    'Black colorway',
    'Machine washable',
    'Embroidered ANTRO logo',
  ],
  shippingInfo: 'Free shipping on all orders. Estimated delivery: 3–5 business days.',
}

// For scalability: export as array (can add more products later)
export const products: Product[] = [mainProduct]

// Helper to get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
