'use client'

import Link from 'next/link'
import { ShoppingCart, Menu } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import CartBadge from '@/components/ui/CartBadge'
import MobileMenu from '@/components/layout/MobileMenu'
import { NAV_LINKS } from '@/data/nav-links'

export default function Header() {
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const desktopLinks = NAV_LINKS.filter(link => link.href !== '/cart')

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[120] isolate bg-white dark:bg-[#0f0f0f] border-b border-black/20 dark:border-white/15 transition-colors duration-[400ms]">
        <nav className="relative z-10 px-6 md:px-12 py-[15px]">
          <div className="relative flex items-center">
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 touch-manipulation"
                aria-label="Open menu"
              >
                <Menu size={20} strokeWidth={1.5} className="pointer-events-none" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {desktopLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="text-[10px] tracking-[0.22em] underline-reveal">
                  {label}
                </Link>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 flex justify-center">
              <Link
                href="/"
                className="pointer-events-auto font-display font-light tracking-[0.3em] text-lg md:text-xl whitespace-nowrap"
              >
                ANTRO
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-3 md:gap-5">
              <ThemeToggle />
              <Link href="/cart" className="relative touch-manipulation" aria-label="Cart">
                <ShoppingCart size={18} strokeWidth={1.5} className="pointer-events-none" />
                <CartBadge count={itemCount} />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
