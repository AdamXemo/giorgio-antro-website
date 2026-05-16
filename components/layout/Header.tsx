'use client'

import Link from 'next/link'
import { ShoppingCart, Menu } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { useState, useEffect } from 'react'
import CartBadge from '@/components/ui/CartBadge'
import MobileMenu from '@/components/layout/MobileMenu'
import { NAV_LINKS } from '@/data/nav-links'
import { useCheckoutSummary } from '@/components/checkout/CheckoutSummaryContext'
import { CheckoutHeaderPanel } from '@/components/checkout/CheckoutHeaderPanel'
import { ItemList, Totals } from '@/components/checkout/CheckoutOrderSummary'

export default function Header() {
  const { itemCount } = useCart()
  const { summary } = useCheckoutSummary()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const desktopLinks = NAV_LINKS.filter(link => link.href !== '/cart')

  useEffect(() => {
    if (!summary) setSummaryOpen(false)
  }, [summary])

  return (
    <>
      {/* Dimming overlay — z-119, behind header, above page content */}
      {summary && (
        <div
          className={`
            fixed inset-0 z-[119] bg-black/50 dark:bg-black/60
            transition-opacity duration-300
            ${summaryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setSummaryOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-[120] isolate bg-white dark:bg-[#0f0f0f] border-b border-black/20 dark:border-white/15 transition-colors duration-[400ms]">
        <nav className="relative z-10 px-6 md:px-12 py-[15px]">
          <div className="relative flex items-center">

            {/* Left slot */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 touch-manipulation"
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
              {/* Mobile checkout: summary toggle */}
              {summary && (
                <div className="md:hidden">
                  <CheckoutHeaderPanel
                    total={summary.total}
                    isOpen={summaryOpen}
                    onToggle={() => setSummaryOpen((v) => !v)}
                  />
                </div>
              )}

              {/* Cart link — direct flex item, no wrapper div.
                  Hidden on mobile checkout (toggle replaces it), visible everywhere else. */}
              <Link
                href="/cart"
                className={`relative touch-manipulation${summary ? ' hidden md:inline-flex' : ''}`}
                aria-label="Cart"
              >
                <ShoppingCart size={18} strokeWidth={1.5} className="pointer-events-none" />
                <CartBadge count={itemCount} />
              </Link>
            </div>

          </div>
        </nav>

        {/* Full-width summary dropdown — absolute child of header so left-0 right-0 = viewport width */}
        {summary && (
          <div
            className={`
              md:hidden absolute top-full left-0 right-0
              grid transition-[grid-template-rows] duration-300 ease-in-out
              ${summaryOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
            `}
          >
            <div className="overflow-hidden">
              <div className="bg-white dark:bg-[#0f0f0f] border-b border-black/20 dark:border-white/15 px-6 py-5">
                <ItemList items={summary.items} />
                <div className="mt-5 pt-5 border-t border-black/8 dark:border-white/8">
                  <Totals
                    subtotal={summary.subtotal}
                    shipping={summary.shipping}
                    total={summary.total}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
