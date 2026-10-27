'use client'

import Link from 'next/link'
import { ShoppingCart, Menu } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { useState } from 'react'
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

  // The panel can only be open when there is a summary to show. Deriving that
  // here rather than resetting the flag from an effect means the closed state
  // is correct on the render where `summary` goes away, with no extra pass.
  const isSummaryOpen = summaryOpen && Boolean(summary)

  return (
    <>
      {/* Dimming overlay — z-119, behind header, above page content */}
      {summary && (
        <div
          className={`
            fixed inset-0 z-[119] bg-black/50
            transition-opacity duration-300
            ${isSummaryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setSummaryOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-[120] isolate h-[var(--header-height)] bg-white border-b border-black/20 transition-colors duration-[400ms]">
        <nav className="relative z-10 h-full px-6 md:px-12">
          <div className="relative flex h-full items-center">

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
                <Link key={href} href={href} className="font-sans text-[11px] tracking-[0.22em] underline-reveal">
                  {label}
                </Link>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 flex justify-center">
              <Link
                href="/"
                className="pointer-events-auto font-display font-semibold tracking-[0.25em] text-2xl md:text-3xl whitespace-nowrap"
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
                    isOpen={isSummaryOpen}
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
              ${isSummaryOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
            `}
          >
            <div className="overflow-hidden">
              <div className="bg-white border-t border-b border-black/20 px-6 py-5">
                <ItemList items={summary.items} />
                <div className="mt-5 pt-5 border-t border-black/8">
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
