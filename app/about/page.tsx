import Image from 'next/image'

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
    <div className="pt-[73px]">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[380px] flex items-end overflow-hidden bg-black">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
          alt="ANTRO fashion store"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="relative z-10 px-6 md:px-12 pb-14 text-white">
          <p className="text-[10px] tracking-[0.3em] text-white/35 mb-5">ABOUT</p>
          <h1 className="font-display font-light text-5xl md:text-7xl leading-none">ANTRO</h1>
          <p className="text-sm text-white/45 mt-4 font-light italic">
            Where style meets substance.
          </p>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-lg mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-black/35 dark:text-white/35 mb-14">OUR STORY</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div className="space-y-6 text-sm leading-loose text-black/60 dark:text-white/60">
              <p>
                ANTRO was born from a simple vision: to create streetwear that doesn&apos;t
                compromise on quality, design, or authenticity. We believe that what you wear
                should be an extension of who you are — bold, unique, and unapologetically yourself.
              </p>
              <p>
                Every piece in our collection is carefully designed with attention to detail,
                from the fabric selection to the final stitch. We&apos;re not just making clothes;
                we&apos;re crafting experiences.
              </p>
            </div>
            <div className="space-y-6 text-sm leading-loose text-black/60 dark:text-white/60">
              <p>
                Our commitment goes beyond fashion. We&apos;re building a community of individuals
                who value self-expression, creativity, and quality. Each ANTRO piece tells a
                story — now it&apos;s time for you to write yours.
              </p>
              <p>
                From concept to creation, every decision is intentional. Every detail matters.
                That is the ANTRO standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-black text-white">
        <div className="max-w-screen-lg mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-white/25 mb-16">OUR VALUES</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {VALUES.map(({ letter, title, body }) => (
              <div key={letter}>
                <p className="font-display font-light text-[6rem] text-white/8 leading-none mb-6">
                  {letter}
                </p>
                <p className="text-[10px] tracking-[0.25em] mb-4">{title}</p>
                <p className="text-sm text-white/45 leading-loose">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 border-t border-black dark:border-white/15">
        <div className="max-w-screen-md mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] text-black/35 dark:text-white/35 mb-10">MISSION</p>
          <h2 className="font-display font-light italic text-3xl md:text-5xl leading-snug mb-10">
            Redefining fashion for<br />the modern generation.
          </h2>
          <p className="text-sm text-black/45 dark:text-white/45 leading-loose">
            To empower individuals through premium streetwear that combines timeless design
            with contemporary style — one piece at a time.
          </p>
        </div>
      </section>

    </div>
  )
}
