'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-[38px] h-[38px] flex items-center justify-center hover:scale-110 transition-transform duration-200 ${className}`}
    >
      {/* Sun — shown in light mode */}
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center transition-all duration-[450ms]"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(90deg) scale(0.45)' : 'rotate(0deg) scale(1)',
          transitionTimingFunction: isDark
            ? 'cubic-bezier(0.4, 0, 0.6, 1)'
            : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Sun size={17} strokeWidth={1.5} />
      </span>

      {/* Moon — shown in dark mode */}
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center transition-all duration-[450ms]"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.45)',
          transitionTimingFunction: isDark
            ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'cubic-bezier(0.4, 0, 0.6, 1)',
        }}
      >
        <Moon size={16} strokeWidth={1.5} />
      </span>
    </button>
  )
}
