import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

const HERO_LETTERS = ['A', 'N', 'T', 'R', 'O']

const STORY_BLOCKS = [
  {
    n: '01',
    heading: 'The Vision',
    body: 'ANTRO was born from a simple belief: that streetwear should never compromise on quality, design, or authenticity. What you wear should be an extension of who you are — bold, unique, and unapologetically yourself.',
  },
  {
    n: '02',
    heading: 'The Craft',
    body: 'Every piece in our collection is designed with obsessive attention to detail — from fabric weight to finishing. We are not just making clothes; we are crafting experiences that outlast every passing trend.',
  },
  {
    n: '03',
    heading: 'The Standard',
    body: 'From concept to creation, every decision is intentional. Based worldwide and shipping globally, because great style has no borders. That is the ANTRO standard.',
  },
]

const VALUES = [
  {
    letter: 'Q',
    title: 'QUALITY',
    body: 'Premium materials and expert craftsmanship in every piece we create.',
  },
  {
    letter: 'A',
    title: 'AUTHENTICITY',
    body: 'Staying true to our vision and values, never following trends blindly.',
  },
  {
    letter: 'C',
    title: 'COMMUNITY',
    body: 'Building connections with our customers and supporting creative expression.',
  },
]

export default function AboutPage() {
  return (
    <div>

      {/* ── Hero — full-screen bleed, no wrapper gap ─────── */}
      <section className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">

        {/* Ken Burns background — more visible than home since this is the brand page */}
        <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="ANTRO fashion store"
            fill
            sizes="100vw"
            priority
            className="pointer-events-none object-cover object-center opacity-40 animate-ken-burns"
          />
          {/* Gradient: heavy at bottom for text legibility, lighter at top */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/25" />
        </div>

        {/* Clears the fixed header — same pattern as home */}
        <div className="h-[73px] flex-shrink-0" />

        {/* Editorial label — top right */}
        <div className="relative z-10 px-6 md:px-12 flex justify-end">
          <p className="text-[9px] tracking-[0.35em] text-white/20 animate-reveal-fade animate-delay-1000">
            EST. 2024
          </p>
        </div>

        {/* Main content — sits at the bottom */}
        <div className="relative z-10 flex flex-col justify-end flex-1 px-6 md:px-12 pb-16">

          <p className="text-[10px] tracking-[0.3em] text-white/35 mb-6 animate-reveal-fade animate-delay-300">
            ABOUT
          </p>

          {/* ANTRO — exact same scale and cadence as home hero */}
          <h1
            className="font-display font-light leading-[0.88] tracking-tight
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

          {/* Accent line */}
          <div className="mt-8">
            <div className="h-px w-16 bg-white/20 animate-draw-line animate-delay-600" />
          </div>

          {/* Subtitle */}
          <p className="mt-6 text-sm text-white/45 font-light italic animate-reveal-fade animate-delay-700">
            Where style meets substance.
          </p>
        </div>
      </section>

      {/* ── Pull Quote ───────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-white dark:bg-[#0f0f0f]">
        <div className="max-w-screen-lg mx-auto">
          <ScrollReveal>
            <blockquote
              className="font-display font-light italic
                         text-[6.5vw] sm:text-[5vw] md:text-[3.8vw] lg:text-[3.2vw]
                         leading-[1.2] text-black/75 dark:text-white/75"
            >
              &ldquo;Elegance and technology —<br className="hidden md:block" />
              crafted for the modern individual.&rdquo;
            </blockquote>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="mt-10 flex items-center gap-5">
              <div className="h-px w-8 bg-black/20 dark:bg-white/20" />
              <p className="text-[9px] tracking-[0.3em] text-black/30 dark:text-white/30">ANTRO BRAND STATEMENT</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Story — numbered editorial blocks ────────────── */}
      <section className="px-6 md:px-12 border-t border-black/8 dark:border-white/8">
        <div className="max-w-screen-lg mx-auto">
          {STORY_BLOCKS.map(({ n, heading, body }, i) => (
            <ScrollReveal key={n} delay={i * 60}>
              <div className="group grid grid-cols-[3rem_1fr] md:grid-cols-[6rem_1fr_1fr] gap-6 md:gap-12 py-12 md:py-14 border-b border-black/8 dark:border-white/8">

                {/* Number */}
                <span className="text-[10px] tracking-[0.25em] text-black/25 dark:text-white/25 pt-1">
                  {n}
                </span>

                {/* Heading */}
                <h3 className="font-display font-light text-2xl md:text-3xl leading-tight self-start">
                  {heading}
                </h3>

                {/* Body — full width on mobile, second column on md+ */}
                <p className="col-start-2 md:col-start-3 text-sm leading-loose text-black/55 dark:text-white/55">
                  {body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Values — full-width horizontal rows ──────────── */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-black text-white">
        <div className="max-w-screen-lg mx-auto">

          <ScrollReveal>
            <p className="text-[10px] tracking-[0.3em] text-white/25 mb-4">OUR VALUES</p>
            <div className="h-px w-full bg-white/10 mb-0" />
          </ScrollReveal>

          {VALUES.map(({ letter, title, body }, i) => (
            <ScrollReveal key={letter} delay={i * 100}>
              <div
                className="group flex items-center gap-8 md:gap-14 py-10 md:py-12
                           border-b border-white/10 hover:border-white/20
                           transition-colors duration-300 cursor-default"
              >
                {/* Giant letter */}
                <span
                  className="font-display font-light text-[4.5rem] md:text-[6rem] leading-none
                             text-white/20 group-hover:text-white/40
                             transition-colors duration-500 w-20 md:w-28 flex-shrink-0 select-none"
                >
                  {letter}
                </span>

                {/* Title */}
                <div className="flex-shrink-0 w-28 md:w-40">
                  <p className="text-[10px] tracking-[0.28em]">{title}</p>
                </div>

                {/* Thin divider — hidden on mobile */}
                <div className="hidden md:block h-px flex-1 bg-white/8 group-hover:bg-white/15 transition-colors duration-500" />

                {/* Body */}
                <p className="flex-1 text-sm text-white/45 leading-loose group-hover:text-white/60 transition-colors duration-300">
                  {body}
                </p>

                {/* Number — far right */}
                <span className="hidden md:block text-[9px] tracking-[0.2em] text-white/15 flex-shrink-0">
                  0{i + 1}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────── */}
      <section className="py-28 md:py-44 px-6 md:px-12">
        <div className="max-w-screen-md mx-auto text-center">

          <ScrollReveal>
            <p className="text-[10px] tracking-[0.3em] text-black/30 dark:text-white/30 mb-8">
              MISSION
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className="font-display font-light italic text-4xl md:text-6xl leading-[1.1] mb-12">
              Redefining fashion<br />for the modern<br />generation.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-sm text-black/45 dark:text-white/45 leading-loose max-w-sm mx-auto mb-14">
              To empower individuals through premium streetwear that combines
              timeless design with contemporary style — one piece at a time.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <Link
              href="/products"
              className="inline-flex items-center gap-6 group"
            >
              <span className="text-[10px] tracking-[0.3em] border-b border-black/25 dark:border-white/25 pb-0.5 hover:border-black dark:hover:border-white transition-colors duration-300">
                SHOP THE COLLECTION
              </span>
            </Link>
          </ScrollReveal>

        </div>
      </section>

    </div>
  )
}
