import { useState, useRef, useLayoutEffect, useCallback } from 'react'

export const COLLAPSED_PEEK = 165

export function useMobileBottomSheet() {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [collapsedY, setCollapsedY] = useState(500)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartY = useRef<number | null>(null)
  const dragStartExpanded = useRef(false)

  useLayoutEffect(() => {
    if (sheetRef.current) {
      setCollapsedY(sheetRef.current.offsetHeight - COLLAPSED_PEEK)
    }
  }, [])

  const baseY = isExpanded ? 0 : collapsedY
  const rawDrag = isDragging ? dragY : 0
  const clampedDrag = Math.max(-baseY, Math.min(rawDrag, collapsedY - baseY))
  const translateY = baseY + clampedDrag

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      dragStartExpanded.current = isExpanded
      setIsDragging(true)
    },
    [isExpanded],
  )

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    setDragY(e.touches[0].clientY - touchStartY.current)
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null) return
      const delta = e.changedTouches[0].clientY - touchStartY.current
      const threshold = collapsedY * 0.3

      if (dragStartExpanded.current) {
        setIsExpanded(delta <= threshold)
      } else {
        setIsExpanded(delta < -threshold)
      }

      touchStartY.current = null
      setIsDragging(false)
      setDragY(0)
    },
    [collapsedY],
  )

  return {
    sheetRef,
    isExpanded,
    translateY,
    isDragging,
    toggle: () => setIsExpanded(p => !p),
    dragHandlers: { onTouchStart, onTouchMove, onTouchEnd },
  }
}
