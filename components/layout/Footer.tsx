import Link from 'next/link'
import { Instagram } from 'lucide-react'
import TikTokIcon from '@/components/icons/TikTokIcon'
import { SOCIAL_LINKS } from '@/data/social-links'
import ScrollReveal from '@/components/ui/ScrollReveal'

const FOOTER_COLUMNS = [
  {
    heading: 'COMPANY',
    links: [
      { href: '/about', label: 'ABOUT' },
      { href: '/contact', label: 'CONTACT' },
      { href: '/products', label: 'SHOP' },
    ],
  },
  {
    heading: 'LEGAL',
    links: [
      { href: '/privacy', label: 'PRIVACY' },
      { href: '/terms', label: 'TERMS' },
      { href: '/returns', label: 'RETURNS' },
      { href: '/shipping', label: 'SHIPPING' },
    ],
  },
]

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
          <div className="flex flex-col sm:flex-row items-start justify-between gap-12 sm:gap-8">
            <Link href="/" className="font-display font-light text-xl tracking-[0.3em]">
              ANTRO
            </Link>

            {/* Two columns at every width — four legal links in one stack would run too long */}
            <nav className="grid grid-cols-2 gap-x-10 gap-y-4 sm:gap-x-16">
              {FOOTER_COLUMNS.map(({ heading, links }) => (
                <div key={heading}>
                  <h2 className="text-[9px] tracking-[0.25em] text-white/25 mb-4">{heading}</h2>
                  <ul className="flex flex-col gap-3">
                    {links.map(({ href, label }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className="text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
