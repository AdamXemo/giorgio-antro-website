import Link from 'next/link'
import Image from 'next/image'
import { mainProduct } from '@/data/products'
import FeaturesList from '@/components/product/FeaturesList'

const MARQUEE_ITEMS = [
  'PREMIUM HEAVYWEIGHT COTTON',
  'FREE SHIPPING ON ALL ORDERS',
  'LIMITED RELEASE — CLASSIC HOODIE',
  'CRAFTED FOR THE MODERN INDIVIDUAL',
  'SECURE CHECKOUT VIA STRIPE',
  'EASY 30-DAY RETURNS',
]
const DOUBLED_MARQUEE = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

export default function Home() {

  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
        {/* Product image, heavily suppressed — atmosphere only */}
        <div className="absolute inset-0">
          <Image
            src={mainProduct.images[0]}
            alt={mainProduct.name}
            fill
            className="object-cover opacity-[0.18]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        </div>

        {/* Spacer for fixed header */}
        <div className="h-[73px] flex-shrink-0" />

        {/* Content — centered vertically in the hero */}
        <div className="relative z-10 flex flex-col justify-center flex-1 px-6 md:px-12">
          <h1 className="text-center font-display font-light leading-[0.88] tracking-tight animate-reveal-up text-[17vw] sm:text-[14vw] md:text-[12vw] lg:text-[10.5vw]">
            ANTRO
          </h1>
          <div className="mt-10 md:mt-14 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-center gap-8">
            <p className="text-sm font-light text-white/45 max-w-xs leading-relaxed animate-reveal-fade animate-delay-200">
              Elegance and technology
            </p>
            <Link
              href={`/product/${mainProduct.id}`}
              className="group inline-flex items-center gap-6 animate-reveal-fade animate-delay-300"
            >
              <span className="text-[10px] tracking-[0.3em] border-b border-white/30 pb-0.5 hover:border-white transition-colors">
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

            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden group bg-[#f0f0f0] dark:bg-[#1c1c1c]">
              <Image
                src={mainProduct.images[0]}
                alt={mainProduct.name}
                fill
                className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
            </div>

            {/* Details */}
            <div className="lg:sticky lg:top-28 space-y-10">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-black/35 dark:text-white/35 mb-5">THE CLASSIC</p>
                <h2 className="font-display font-light text-4xl md:text-5xl leading-tight mb-4">
                  {mainProduct.name}
                </h2>
                <p className="text-2xl font-light tabular-nums">€{mainProduct.price}</p>
              </div>

              <p className="font-body text-sm leading-loose text-black/55 dark:text-white/55">
                {mainProduct.description}
              </p>

              <div>
                <p className="text-[10px] tracking-[0.25em] mb-4">DETAILS</p>
                <FeaturesList features={mainProduct.features.slice(0, 6)} />
              </div>

              <Link
                href={`/product/${mainProduct.id}`}
                className="block w-full text-center bg-black text-white py-4 text-[10px] tracking-[0.28em] border border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-transparent dark:hover:text-white transition-colors duration-300"
              >
                VIEW &amp; PURCHASE — €{mainProduct.price}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Statement ───────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-black text-white">
        <div className="max-w-screen-md mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] text-white/25 mb-10">ABOUT ANTRO</p>
          <h2 className="font-display font-light italic text-4xl md:text-6xl leading-snug mb-10">
            More than clothing.<br />
            A statement.
          </h2>
          <p className="text-sm leading-loose text-white/45 max-w-sm mx-auto">
            From concept to creation — quality you feel, style you live.
            Each ANTRO piece is crafted with intention for the modern individual.
          </p>
        </div>
      </section>

    </div>
  )
}
