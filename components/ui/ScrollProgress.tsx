'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      const progress = max > 0 ? scrollTop / max : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed top-0 left-0 right-0 z-[125] h-px">
      <div
        ref={barRef}
        className="h-full bg-black origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
