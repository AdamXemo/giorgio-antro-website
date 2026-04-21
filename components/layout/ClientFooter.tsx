'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'

const IMMERSIVE_ROUTES = ['/checkout']

export default function ClientFooter() {
  const pathname = usePathname()
  const isImmersive = IMMERSIVE_ROUTES.some((r) => pathname.startsWith(r))

  if (isImmersive) return null

  return (
    <>
      <ScrollProgress />
      <Footer />
    </>
  )
}
