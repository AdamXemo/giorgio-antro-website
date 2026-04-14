import Link from 'next/link'
import Image from 'next/image'
import { mainProduct } from '@/data/products'
import FeaturesList from '@/components/product/FeaturesList'
import ScrollReveal from '@/components/ui/ScrollReveal'

const MARQUEE_ITEMS = [
  'PREMIUM HEAVYWEIGHT COTTON',
  'FREE SHIPPING ON ALL ORDERS',
  'LIMITED RELEASE — CLASSIC HOODIE',
  'CRAFTED FOR THE MODERN INDIVIDUAL',
  'SECURE CHECKOUT VIA STRIPE',
  'EASY 30-DAY RETURNS',
]
const DOUBLED_MARQUEE = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

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
            src={mainProduct.images[0]}
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

      {/* ── Marquee Strip ────────────────────────────────── */}
      <div className="bg-black text-white py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {DOUBLED_MARQUEE.map((item, i) => (
            <span key={i} className="text-[9px] tracking-[0.28em] mx-8">
              {item}
              <span className="mx-7 opacity-25">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Product Showcase ──────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Image — reveal from left */}
            <ScrollReveal>
              <div className="relative aspect-[3/4] overflow-hidden group bg-[#f0f0f0] dark:bg-[#1c1c1c]">
                <Image
                  src={mainProduct.images[0]}
                  alt={mainProduct.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
              </div>
            </ScrollReveal>

            {/* Details — staggered reveal */}
            <div className="lg:sticky lg:top-28 space-y-10">
              <ScrollReveal delay={80}>
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-black/35 dark:text-white/35 mb-5">THE CLASSIC</p>
                  <h2 className="font-display font-light text-4xl md:text-5xl leading-tight mb-4">
                    {mainProduct.name}
                  </h2>
                  <p className="text-2xl font-light tabular-nums">€{mainProduct.price}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <p className="font-body text-sm leading-loose text-black/55 dark:text-white/55">
                  {mainProduct.description}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                <div>
                  <p className="text-[10px] tracking-[0.25em] mb-4">DETAILS</p>
                  <FeaturesList features={mainProduct.features.slice(0, 6)} />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={320}>
                <Link
                  href={`/product/${mainProduct.id}`}
                  className="block w-full text-center bg-black text-white py-4 text-[10px] tracking-[0.28em] border border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-transparent dark:hover:text-white transition-colors duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">VIEW &amp; PURCHASE — €{mainProduct.price}</span>
                  <span className="absolute inset-0 bg-white dark:bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
                </Link>
              </ScrollReveal>
            </div>
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
