import Link from 'next/link'
import { Instagram } from 'lucide-react'
import TikTokIcon from '@/components/icons/TikTokIcon'
import { SOCIAL_LINKS } from '@/data/social-links'

export default function Footer() {
  const instagram = SOCIAL_LINKS.find(l => l.platform === 'instagram')!
  const tiktok = SOCIAL_LINKS.find(l => l.platform === 'tiktok')!

  return (
    <footer className="bg-black text-white py-10 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <Link href="/" className="font-display font-light text-xl tracking-[0.3em]">
            ANTRO
          </Link>

          <nav className="flex flex-col gap-3">
            <Link href="/about"   className="text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition-colors">ABOUT</Link>
            <Link href="/contact" className="text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition-colors">CONTACT</Link>
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

        <p className="mt-10 text-[10px] tracking-[0.2em] text-white/25">
          &copy; {new Date().getFullYear()} ANTRO. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
