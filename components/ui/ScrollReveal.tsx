'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * ScrollReveal — pure inline-style implementation.
 *
 * Why animations instead of transitions:
 * CSS transitions require a committed "from" paint state before the property
 * changes. Forcing that reliably across all mobile browsers (iOS Safari,
 * Android Chrome) requires layout-flush tricks that don't always work.
 * CSS animations always start fresh from the `from` keyframe the moment the
 * class is added — no flush, no double-RAF, no race conditions.
 *
 * Flow:
 *  1. Mount: add `.sr-hidden` (opacity:0) — content invisible until in view
 *  2. In viewport: remove `.sr-hidden`, add `.animate-scroll-reveal`
 *     → animation runs from opacity:0/translateY to opacity:1/translateY(0)
 *  3. `animation-fill-mode: both` keeps the `from` state during any delay
 *     and the `to` state after the animation ends
 */
export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isMobileViewport = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      el.classList.remove(
        'sr-hidden',
        'sr-hidden-mobile',
        'animate-scroll-reveal',
        'animate-scroll-reveal-mobile'
      )
      el.style.removeProperty('animation-delay')
      return
    }

    const revealDelay = isMobileViewport ? Math.round(delay * 2) : delay

    const show = () => {
      el.classList.remove('sr-hidden', 'sr-hidden-mobile')
      el.classList.add(isMobileViewport ? 'animate-scroll-reveal-mobile' : 'animate-scroll-reveal')
      if (revealDelay > 0) {
        el.style.animationDelay = `${revealDelay}ms`
      } else {
        el.style.removeProperty('animation-delay')
      }
    }

    // Hide now that JS is running (no opacity:0 during SSR — avoids blank flash)
    el.classList.remove('animate-scroll-reveal', 'animate-scroll-reveal-mobile')
    el.classList.add(isMobileViewport ? 'sr-hidden-mobile' : 'sr-hidden')

    // Already in or very close to the viewport → reveal on next frame
    // (one frame lets the hidden state be painted before the animation fires)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 20) {
      const raf = requestAnimationFrame(show)
      return () => cancelAnimationFrame(raf)
    }

    // Below the fold → watch with IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show()
          observer.unobserve(el)
        }
      },
      // Positive bottom margin triggers before the element is visible.
      { threshold: 0.01, rootMargin: isMobileViewport ? '0px 0px 180px 0px' : '0px 0px 80px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
