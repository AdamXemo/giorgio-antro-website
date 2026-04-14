/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.117'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Shopify product images
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },
}

module.exports = nextConfig


