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
}

// Main product - ANTRO Classic Hoodie
export const mainProduct: Product = {
  id: 'antro-classic-hoodie',
  name: 'Sailor Hooded Jacket',
  price: 120,
  description:
    'The Sailor Hooded Jacket is a modern adaptation of a zip hoodie. This jacket features a unique cut that can be styled in various ways. The hood itself is one large pattern piece that is integrated into the jacket. The garment is crafted from 100% cotton, designed with a fluid and relaxed unisex silhouette. It is a versatile designer piece that reflects understated luxury and contemporary elegance.',
    images: [
    '/g_antro_hoodie.png',
    '/g_antro_hoodie.png',
    '/g_antro_hoodie.png',
    '/g_antro_hoodie.png',
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
