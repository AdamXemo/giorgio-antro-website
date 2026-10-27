'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function SideDrawer({ isOpen, onClose, title, children }: SideDrawerProps) {
  // Stable ref so the effect never needs to re-attach when onClose changes identity
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* Backdrop — dims the left panel while the drawer is open */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          'fixed inset-0',
          'bg-black/60',
          'z-[140] transition-opacity duration-500',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-label={title}
        className={[
          'fixed top-0 right-0 w-1/2 h-screen',
          'bg-[var(--background)] border-l border-black/[0.08]',
          'z-[150] overflow-y-auto',
          'transition-transform duration-500',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Close — top-right corner X */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-6 p-1 text-black hover:opacity-60 transition-opacity duration-200"
        >
          <X size={26} strokeWidth={1.25} />
        </button>

        <div className="px-20 xl:px-28 pt-[117px] pb-12">
          {title && (
            <p className="text-[9px] tracking-[0.25em] mb-8">{title}</p>
          )}
          {children}
        </div>
      </div>
    </>
  )
}
