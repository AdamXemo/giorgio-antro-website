import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/CartContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemedToaster } from '@/components/ThemedToaster'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fontSans, fontDisplay, fontBody } from '@/lib/fonts'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ANTRO - Premium Streetwear',
  description: 'Discover unique, high-quality streetwear designed for the modern individual.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable} ${fontBody.variable}`} suppressHydrationWarning>
      {/* Prevents flash of wrong theme on load */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <ThemedToaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
