import Link from 'next/link'
import Image from 'next/image'
import { mainProduct } from '@/data/products'
import ScrollReveal from '@/components/ui/ScrollReveal'
import HomeGallery from '@/components/home/HomeGallery'

const HERO_LETTERS = ['A', 'N', 'T', 'R', 'O']

// ── Hero framing knobs — tweak these two values to place things perfectly ──
// Vertical crop of the hero photo. 0% frames the very top (ceiling/heads),
// 100% the floor. Lower keeps the heads in view; raise to reveal more torso.
// Stay under ~35% or the heads start getting cropped on wide screens.
const HERO_IMAGE_POSITION = 'center 20%'
// Vertical centre of the ANTRO title, as a % of the hero height. 50% = dead
// centre. Lower moves the title up; higher moves it down (onto more torso).
const HERO_TITLE_TOP = '50%'

export default function Home() {
  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-black text-white overflow-hidden">

        {/* Full-screen hero image, framed on the upper bodies/heads via
            HERO_IMAGE_POSITION (object-position). */}
        <div aria-hidden className="absolute inset-0 select-none">
          <Image
            src="/home/hero.jpg"
            alt={mainProduct.name}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: HERO_IMAGE_POSITION }}
            priority
          />
        </div>

        {/* Hero content — title vertically centred at HERO_TITLE_TOP, over the
            black of the jackets so the white wordmark stays fully legible. */}
        <div
          className="absolute inset-x-0 z-10 -translate-y-1/2 px-6 md:px-12"
          style={{ top: HERO_TITLE_TOP }}
        >

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

      {/* ── Editorial Gallery ─────────────────────────────── */}
      <HomeGallery />

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
