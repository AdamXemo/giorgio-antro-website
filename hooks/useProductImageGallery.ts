import { useState, useCallback } from 'react'

interface UseProductImageGalleryReturn {
  selectedImage: number
  setSelectedImage: (index: number) => void
  prev: () => void
  next: () => void
  isDragging: boolean
  dragOffset: number
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
  }
}

export function useProductImageGallery(totalImages: number): UseProductImageGalleryReturn {
  const [selectedImage, setSelectedImage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const prev = useCallback(
    () => setSelectedImage(i => (i - 1 + totalImages) % totalImages),
    [totalImages],
  )
  const next = useCallback(
    () => setSelectedImage(i => (i + 1) % totalImages),
    [totalImages],
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    setDragOffset(e.touches[0].clientX - touchStart)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const delta = touchStart - e.changedTouches[0].clientX
    if (Math.abs(delta) > 48) delta > 0 ? next() : prev()
    setTouchStart(null)
    setIsDragging(false)
    setDragOffset(0)
  }

  return {
    selectedImage,
    setSelectedImage,
    prev,
    next,
    isDragging,
    dragOffset,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  }
}
