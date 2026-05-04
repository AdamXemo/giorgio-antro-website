import { useState, useRef, useEffect, useCallback } from 'react'

export const COLLAPSED_PEEK = 165

export function useMobileBottomSheet() {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [collapsedY, setCollapsedY] = useState(500)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartY = useRef<number | null>(null)
  const dragStartExpanded = useRef(false)

  useEffect(() => {
    const el = sheetRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setCollapsedY(el.offsetHeight - COLLAPSED_PEEK)
    })
    observer.observe(el)
    return () => observer.disconnect()
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

    // Walk up from the touch target to the sheet boundary. If any ancestor is a
    // scrollable container with content already scrolled, yield to native scroll.
    const sheet = sheetRef.current
    if (sheet) {
      let node: HTMLElement | null = e.target as HTMLElement
      while (node && node !== sheet) {
        if (node.scrollHeight > node.clientHeight && node.scrollTop > 0) {
          touchStartY.current = null
          setIsDragging(false)
          setDragY(0)
          return
        }
        node = node.parentElement
      }
    }

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
