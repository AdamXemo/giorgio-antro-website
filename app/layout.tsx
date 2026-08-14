import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/cart/CartContext'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import ClientFooter from '@/components/layout/ClientFooter'
import { fontSans, fontDisplay, fontBody, fontHero } from '@/lib/fonts'
import { CheckoutSummaryProvider } from '@/components/checkout/CheckoutSummaryContext'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ANTRO',
  description:
    'ANTRO is an independent label by Giorgio Antro. Relaxed, unisex tailoring made in small quantities. Brussels.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontBody.variable} ${fontHero.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <CartProvider>
          <CheckoutSummaryProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <ClientFooter />
            <Toaster position="bottom-right" theme="light" />
          </CheckoutSummaryProvider>
        </CartProvider>
      </body>
    </html>
  )
}
