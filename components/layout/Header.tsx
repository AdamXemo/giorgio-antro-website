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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black dark:bg-[#0f0f0f] dark:border-white/15 transition-colors duration-400">
        <nav className="px-6 md:px-12 py-[15px]">
          <div className="flex items-center">
            {/* Mobile: Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1 -ml-1 mr-auto"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="font-display font-light tracking-[0.3em] text-lg md:text-xl absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:mr-auto whitespace-nowrap"
            >
              ANTRO
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_LINKS.filter(l => l.href !== '/cart').map(({ href, label }) => (
                <Link key={href} href={href} className="text-[10px] tracking-[0.22em] underline-reveal">
                  {label}
                </Link>
              ))}
              <ThemeToggle />
              <Link href="/cart" className="relative ml-2" aria-label="Cart">
                <ShoppingCart size={18} strokeWidth={1.5} />
                <CartBadge count={itemCount} />
              </Link>
            </div>

            {/* Mobile: ThemeToggle + Cart */}
            <div className="md:hidden flex items-center gap-2 ml-auto">
              <ThemeToggle />
              <Link href="/cart" className="relative p-1" aria-label="Cart">
                <ShoppingCart size={20} strokeWidth={1.5} />
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
