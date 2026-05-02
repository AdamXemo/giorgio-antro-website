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
  onCloseRef.current = onClose

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={title}
      className={[
        'fixed top-[69px] right-0 w-1/2 h-[calc(100vh-69px)]',
        'bg-[var(--background)] border-l border-black/[0.08] dark:border-white/[0.08]',
        'z-40 overflow-y-auto',
        'transition-transform duration-500',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="px-12 xl:px-16 py-12">
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center gap-3 mb-14 text-[9px] tracking-[0.2em] text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-200"
        >
          <X size={14} strokeWidth={1.5} />
          CLOSE
        </button>

        {title && (
          <p className="text-[10px] tracking-[0.25em] mb-8">{title}</p>
        )}

        {children}
      </div>
    </div>
  )
}
