import type { MetadataRoute } from 'next'
import { products } from '@/data/products'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1.0 },
    { url: `${SITE_URL}/products`, priority: 0.9 },
    { url: `${SITE_URL}/about`, priority: 0.7 },
    { url: `${SITE_URL}/contact`, priority: 0.7 },
    { url: `${SITE_URL}/shipping`, priority: 0.5 },
    { url: `${SITE_URL}/returns`, priority: 0.5 },
    { url: `${SITE_URL}/privacy`, priority: 0.3 },
    { url: `${SITE_URL}/terms`, priority: 0.3 },
  ]

  // Derive product URLs from the catalogue — never hardcode ids.
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.id}`,
    priority: 0.9,
  }))

  return [...staticEntries, ...productEntries].map((entry) => ({
    lastModified: now,
    changeFrequency: 'weekly',
    ...entry,
  }))
}
