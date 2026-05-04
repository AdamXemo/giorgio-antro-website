'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { COLLAPSED_PEEK } from '@/hooks/useMobileBottomSheet'

interface MobileProductHeroProps {
  images: string[]
  productName: string
}

const HEADER_HEIGHT = 69

export default function MobileProductHero({ images, productName }: MobileProductHeroProps) {
  const total = images.length
  const [selectedImage, setSelectedImage] = useState(0)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const prev = useCallback(() => setSelectedImage(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setSelectedImage(i => Math.min(total - 1, i + 1)), [total])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return
    setDragOffset(e.touches[0].clientY - touchStartY)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return
    const delta = touchStartY - e.changedTouches[0].clientY
    if (Math.abs(delta) > 48) delta > 0 ? next() : prev()
    setTouchStartY(null)
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
        {images.map((image, index) => (
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
              className="object-contain object-center"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators — left side, centered vertically */}
      {total > 1 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === selectedImage
                  ? 'w-2 h-2 bg-black dark:bg-white'
                  : 'w-1.5 h-1.5 bg-black/25 dark:bg-white/25'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
