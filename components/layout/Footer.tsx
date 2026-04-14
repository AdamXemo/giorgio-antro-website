import Link from 'next/link'
import { Instagram } from 'lucide-react'
import TikTokIcon from '@/components/icons/TikTokIcon'
import { SOCIAL_LINKS } from '@/data/social-links'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function Footer() {
  const instagram = SOCIAL_LINKS.find(l => l.platform === 'instagram')!
  const tiktok = SOCIAL_LINKS.find(l => l.platform === 'tiktok')!

  return (
    <footer className="bg-black text-white pt-14 pb-10 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">

        {/* Thin top accent line — draws in on scroll reveal */}
        <ScrollReveal>
          <div className="mb-12 overflow-hidden">
            <div className="h-px bg-white/10 animate-draw-line" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <Link href="/" className="font-display font-light text-xl tracking-[0.3em]">
              ANTRO
            </Link>

            <nav className="flex flex-col gap-3">
              <Link href="/about"   className="text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition-colors">ABOUT</Link>
              <Link href="/contact" className="text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition-colors">CONTACT</Link>
              <Link href="/products" className="text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition-colors">SHOP</Link>
            </nav>

            <div className="flex items-center gap-5">
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={instagram.label}
                className="text-white/60 hover:text-white transition-colors"
              >
                <Instagram size={17} strokeWidth={1.5} />
              </a>
              <a
                href={tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tiktok.label}
                className="text-white/60 hover:text-white transition-colors"
              >
                <TikTokIcon size={17} />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[10px] tracking-[0.2em] text-white/25">
              &copy; {new Date().getFullYear()} ANTRO. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[9px] tracking-[0.15em] text-white/15 font-body">
              BRUSSELS, BELGIUM
            </p>
          </div>
        </ScrollReveal>

      </div>
    </footer>
  )
}
