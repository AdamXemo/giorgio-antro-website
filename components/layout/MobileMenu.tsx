'use client'

import Link from 'next/link'
import { X, ChevronRight } from 'lucide-react'
import { NAV_LINKS } from '@/data/nav-links'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-slide-down">
      <div className="relative flex items-center justify-center px-6 py-[15px] border-b border-white/10">
        <span className="font-display font-semibold tracking-[0.3em] text-lg">ANTRO</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 -m-2 absolute right-6"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <nav className="flex flex-col flex-1 px-6 pt-6">
        <div className="flex flex-col">
          {NAV_LINKS.map(({ href, mobileLabel }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center justify-between border-b border-white/10 py-5 font-sans text-[18px] font-light"
            >
              <span>{mobileLabel}</span>
              <ChevronRight size={16} strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
