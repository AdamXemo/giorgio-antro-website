/**
 * Canonical production origin for SEO surfaces (robots, sitemap, manifest).
 *
 * Uses NEXT_PUBLIC_SITE_URL when set, otherwise the production domain.
 * Note: this intentionally does NOT fall back to http://localhost:3000 the way
 * `metadataBase` does in app/layout.tsx — robots.txt and sitemap.xml must always
 * advertise the live origin, never a dev URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://giorgioantro.com'
