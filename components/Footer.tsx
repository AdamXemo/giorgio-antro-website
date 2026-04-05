import Link from 'next/link'
import { Instagram } from 'lucide-react'

function TikTokIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.2 8.2 0 0 0 4.78 1.52V6.82a4.85 4.85 0 0 1-1.01-.13z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <Link
            href="/"
            className="font-display font-light text-xl tracking-[0.3em]"
          >
            ANTRO
          </Link>

          <nav className="flex flex-col gap-3">
            <Link href="/about"   className="text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition-colors">ABOUT</Link>
            <Link href="/contact" className="text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition-colors">CONTACT</Link>
          </nav>

          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/giorgioantro/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Instagram size={17} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.tiktok.com/@g.antro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
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
