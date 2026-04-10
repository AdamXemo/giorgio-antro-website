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
  price: 89.99,
  description: 'Antro Sailor Hooded Jacket is a modern adaptation of a zip hoodie. This jacket features a unique cut that can be styled in various ways. The hood itself is one large pattern piece that is integrated into the jacket. The garment is crafted from 100% cotton, designed with a fluid and relaxed unisex silhouette. It is a versatile designer piece that reflects understated luxury and contemporary elegance.',
  images: [
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    '/antro-hoodie.jpg',
    ],
  sizes: ['ONE SIZE'],
  category: 'Hoodies',
  inStock: true,
  features: [
    'Premium heavyweight cotton blend (80% cotton, 20% polyester)',
    'Oversized modern fit',
    'Embroidered ANTRO logo',
    'Reinforced stitching for durability',
    'Ribbed cuffs and hem',
    'Kangaroo front pocket',
    'Adjustable drawstring hood',
    'Pre-shrunk fabric',
    'Machine washable',
    'Unisex design',
  ],
  shippingInfo: 'Free shipping on all orders. Estimated delivery: 3-5 business days.',
}

// For scalability: export as array (can add more products later)
export const products: Product[] = [mainProduct]

// Helper to get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
