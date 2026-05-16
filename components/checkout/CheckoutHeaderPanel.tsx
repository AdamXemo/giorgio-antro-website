'use client'

import { ChevronDown } from 'lucide-react'

interface Props {
  total: number
  isOpen: boolean
  onToggle: () => void
}

export function CheckoutHeaderPanel({ total, isOpen, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 p-2 -mr-2 touch-manipulation"
      aria-label={isOpen ? 'Hide order summary' : 'Show order summary'}
      aria-expanded={isOpen}
    >
      <span className="text-sm tabular-nums tracking-wide">€{total.toFixed(2)}</span>
      <ChevronDown
        size={18}
        strokeWidth={1.5}
        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  )
}
