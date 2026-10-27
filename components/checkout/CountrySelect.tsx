'use client'

import { useState, useRef, useEffect } from 'react'

interface Option {
  code: string
  name: string
}

interface Props {
  id?: string
  value: string
  onChange: (code: string) => void
  options: Option[]
  error?: boolean
}

export function CountrySelect({ id, value, onChange, options, error }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.code === value)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open || !listRef.current) return
    const active = listRef.current.querySelector<HTMLElement>('[data-selected="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    const idx = options.findIndex((o) => o.code === value)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(options[Math.min(idx + 1, options.length - 1)].code)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(options[Math.max(idx - 1, 0)].code)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      setOpen(false)
    }
  }

  const triggerClass = [
    'w-full flex items-center justify-between',
    'border rounded-[2px] bg-transparent px-3 py-2 text-[13px] font-sans',
    'text-black cursor-pointer',
    error
      ? 'border-red-300'
      : 'border-[#eaeaea]',
    open
      ? 'border-black'
      : 'hover:border-black/30',
    'focus:outline-none focus:border-black',
    'transition-colors duration-150',
  ].join(' ')

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
      >
        <span className={selected ? '' : 'text-black/20'}>
          {selected?.name ?? 'Select country'}
        </span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`flex-shrink-0 text-black/35 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className={[
            'absolute z-50 top-full left-0 right-0 mt-0.5',
            'border border-[#eaeaea]',
            'bg-white',
            'max-h-44 overflow-y-auto',
            'rounded-[2px]',
            'shadow-sm',
          ].join(' ')}
        >
          {options.map((o) => {
            const isActive = o.code === value
            return (
              <button
                key={o.code}
                type="button"
                role="option"
                aria-selected={isActive}
                data-selected={isActive}
                onClick={() => { onChange(o.code); setOpen(false) }}
                className={[
                  'w-full text-left px-3 py-1.5 text-[13px]',
                  'transition-colors duration-100',
                  isActive
                    ? 'text-black bg-black/[0.04]'
                    : 'text-black/60 hover:bg-black/[0.03]',
                ].join(' ')}
              >
                {o.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
