import Link from 'next/link'
import Image from 'next/image'
import { mainProduct } from '@/data/products'
import ScrollReveal from '@/components/ui/ScrollReveal'

const HERO_LETTERS = ['A', 'N', 'T', 'R', 'O']

export default function Home() {
  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">

        {/* Background image — Ken Burns slow zoom. pointer-events-none prevents the
            GPU-composited animation layer from swallowing touch events on mobile. */}
        <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
          <Image
            src={mainProduct.mobileImages[0]}
            alt={mainProduct.name}
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-[0.18] animate-ken-burns"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        </div>

        {/* Spacer for fixed header */}
        <div className="h-[73px] flex-shrink-0" />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-center flex-1 px-6 md:px-12">

          {/* ANTRO — each letter clips up independently */}
          <h1
            className="text-center font-display font-light leading-[0.88] tracking-tight
                       text-[17vw] sm:text-[14vw] md:text-[12vw] lg:text-[10.5vw]"
            aria-label="ANTRO"
          >
            {HERO_LETTERS.map((char, i) => (
              <span key={i} className="inline-block overflow-hidden leading-[1.05]">
                <span
                  className="inline-block animate-char-reveal"
                  style={{ animationDelay: `${i * 0.09}s` }}
                >
                  {char}
                </span>
              </span>
            ))}
          </h1>

          {/* Thin horizontal accent line, draws after title */}
          <div className="mt-8 flex justify-center">
            <div
              className="h-px w-16 bg-white/20 animate-draw-line animate-delay-600"
            />
          </div>

          {/* Subtitle + CTA */}
          <div className="mt-8 md:mt-10 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-center gap-8">
            <p className="text-sm font-light text-white/45 max-w-xs leading-relaxed animate-reveal-fade animate-delay-600">
              Elegance and technology
            </p>
            <Link
              href={`/product/${mainProduct.id}`}
              className="group inline-flex items-center gap-6 animate-reveal-fade animate-delay-700"
            >
              <span className="text-[10px] tracking-[0.3em] border-b border-white/30 pb-0.5 hover:border-white transition-colors duration-300">
                SHOP NOW
              </span>
            </Link>
          </div>
        </div>

      </section>

      {/* ── Brand Statement ───────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-black text-white">
        <div className="max-w-screen-md mx-auto text-center">

          <ScrollReveal>
            <p className="text-[10px] tracking-[0.3em] text-white/25 mb-6">ABOUT ANTRO</p>
            {/* Decorative horizontal line */}
            <div className="flex justify-center mb-10">
              <div className="h-px w-10 bg-white/15" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className="font-display font-light italic text-4xl md:text-6xl leading-snug mb-10">
              More than clothing.<br />
              A statement.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-sm leading-loose text-white/45 max-w-sm mx-auto">
              From concept to creation — quality you feel, style you live.
              Each ANTRO piece is crafted with intention for the modern individual.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-12">
              <Link
                href="/about"
                className="text-[10px] tracking-[0.3em] border-b border-white/20 pb-0.5 hover:border-white transition-colors duration-300"
              >
                OUR STORY
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
