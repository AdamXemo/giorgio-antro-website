'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, ChevronRight } from 'lucide-react'
import { useCart } from './CartContext'
import { useState } from 'react'

export default function Header() {
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black">
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
              {[
                { href: '/',          label: 'HOME'    },
                { href: '/products',  label: 'SHOP'    },
                { href: '/about',     label: 'ABOUT'   },
                { href: '/contact',   label: 'CONTACT' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[10px] tracking-[0.22em] underline-reveal"
                >
                  {label}
                </Link>
              ))}
              <Link href="/cart" className="relative ml-2" aria-label="Cart">
                <ShoppingCart size={18} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile: Cart */}
            <Link href="/cart" className="md:hidden relative ml-auto" aria-label="Cart">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-slide-down">
          <div className="relative flex items-center justify-center px-6 py-[15px] border-b border-white/10">
            <span className="font-display font-semibold tracking-[0.3em] text-lg">ANTRO</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 -m-2 absolute right-6"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-col flex-1 px-6 pt-6">
            <div className="flex flex-col">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Shop' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/cart', label: 'Cart' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-white/10 py-5 font-sans text-[18px] font-light"
                >
                  <span>{label}</span>
                  <ChevronRight size={16} strokeWidth={1.5} />
                </Link>
              ))}
            </div>

            {/* Pin login to the bottom (placeholder link for now) */}
            <div className="mt-auto border-t border-white/10 py-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                }}
                className="block font-sans text-[18px] font-light tracking-[0.02em]"
              >
                LOGIN
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
