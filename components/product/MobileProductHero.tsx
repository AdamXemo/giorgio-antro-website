'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { COLLAPSED_PEEK } from '@/hooks/useMobileBottomSheet'

interface MobileProductHeroProps {
  mobileImages: string[]
  productName: string
}

const HEADER_HEIGHT = 69

export default function MobileProductHero({ mobileImages, productName }: MobileProductHeroProps) {
  const total = mobileImages.length
  const [selectedImage, setSelectedImage] = useState(0)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const touchStartTime = useRef<number | null>(null)

  const prev = useCallback(() => setSelectedImage(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setSelectedImage(i => Math.min(total - 1, i + 1)), [total])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
    touchStartTime.current = Date.now()
    setIsDragging(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return
    setDragOffset(e.touches[0].clientY - touchStartY)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return
    const delta = touchStartY - e.changedTouches[0].clientY
    const elapsed = touchStartTime.current !== null ? Date.now() - touchStartTime.current : Infinity
    const velocity = Math.abs(delta) / elapsed
    if (Math.abs(delta) > 48 || velocity > 0.5) delta > 0 ? next() : prev()
    setTouchStartY(null)
    touchStartTime.current = null
    setIsDragging(false)
    setDragOffset(0)
  }

  return (
    <div
      style={{ height: `calc(100dvh - ${HEADER_HEIGHT}px - ${COLLAPSED_PEEK}px)` }}
      className="relative w-full overflow-hidden studio-bg select-none touch-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Vertical image strip */}
      <div
        className="flex flex-col w-full"
        style={{
          height: `${total * 100}%`,
          transform: `translateY(calc(-${(selectedImage * 100) / total}% + ${isDragging ? dragOffset : 0}px))`,
          transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {mobileImages.map((image, index) => (
          <div
            key={index}
            className="relative w-full flex-shrink-0"
            style={{ height: `${100 / total}%` }}
          >
            <Image
              src={image}
              alt={`${productName} — view ${index + 1}`}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators — left side, centered vertically */}
      {total > 1 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5">
          {mobileImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === selectedImage
                  ? 'w-2 h-2 bg-black'
                  : 'w-1.5 h-1.5 bg-black/25'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
