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
const HERO_IMAGE_POSITION = 'center 0%'
// Vertical centre of the ANTRO title, as a % of the hero height. 50% = dead
// centre. Lower moves the title up; higher moves it down (onto more torso).
const HERO_TITLE_TOP = '50%'

export default function Home() {
  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-svh bg-black text-white overflow-hidden">

        {/* Full-screen hero image, framed on the upper bodies/heads via
            HERO_IMAGE_POSITION (object-position). A dedicated portrait crop is
            used on mobile; the wide crop takes over from `sm` up. */}
        <div aria-hidden className="absolute inset-0 select-none">
          {/* Mobile — portrait crop. Each crop is display:none at the other's
              breakpoint, so `sizes` must collapse to ~0 there or the browser
              preloads both full-size heroes on every device. */}
          <Image
            src="/home/mobile-hero.jpg"
            alt={mainProduct.name}
            fill
            sizes="(min-width: 640px) 1px, 100vw"
            className="object-cover object-center sm:hidden"
            quality={90}
            priority
          />
          {/* Desktop / tablet — wide crop */}
          <Image
            src="/home/hero.jpg"
            alt={mainProduct.name}
            fill
            sizes="(min-width: 640px) 100vw, 1px"
            className="hidden object-cover scale-[1.15] sm:block"
            style={{ objectPosition: HERO_IMAGE_POSITION }}
            quality={90}
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
            className="hero-wordmark text-center font-hero font-semibold leading-[0.88] tracking-tight
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

          {/* CTA */}
          <div className="mt-8 md:mt-10 flex flex-col items-center text-center">
            {/* Shared button pattern from globals.css. The label must stay in a
                <span> — `.btn-ghost span` is what sits above the ::before wipe.
                `btn-on-media` keeps it solid white in dark mode: it sits on the
                photograph, which doesn't change with the theme. */}
            <Link
              href={`/product/${mainProduct.id}`}
              className="btn-ghost btn-on-media px-12 py-[18px] text-[13px]
                         animate-reveal-fade animate-delay-700"
            >
              <span>SHOP NOW</span>
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
            <h2 className="font-display font-light italic text-4xl md:text-6xl leading-snug mb-8">
              About Us
            </h2>
            {/* Decorative horizontal line */}
            <div className="flex justify-center mb-10">
              <div className="h-px w-10 bg-white/15" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="space-y-6 text-sm leading-loose text-white/70 max-w-xl mx-auto">
              <p>
                ANTRO is an emerging fashion brand founded by young designer Giorgio Antro,
                currently studying Fashion Design at La Cambre.
              </p>
              <p>
                The brand explores the elegance of relaxed tailoring, freedom of movement,
                and the versatility of form. We create garments in small quantities, focusing
                on silhouette, fit, and the feeling of freedom within clothing.
              </p>
              <p>
                Our pieces are built around a unisex fit — a shape that is not limited to one
                body type or gender. ANTRO creates clothing for people who value individuality,
                quiet elegance, and freedom of self-expression.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
