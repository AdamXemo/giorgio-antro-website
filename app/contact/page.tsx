import ContactForm from '@/components/contact/ContactForm'
import ContactInfoSection from '@/components/contact/ContactInfoSection'

const HEADING_WORDS = ['Get', 'in', 'touch.']

export default function ContactPage() {
  return (
    <div>

      {/* ── Hero — full-bleed, no wrapper gap ────────────── */}
      <section
        className="relative flex flex-col bg-black text-white overflow-hidden"
        style={{ minHeight: 'min(52vh, 480px)', height: '52vh' }}
      >
        <div aria-hidden className="absolute inset-0 pointer-events-none bg-gradient-to-br from-black via-black to-[#111]" />

        {/* Clears fixed header */}
        <div className="h-[73px] flex-shrink-0" />

        {/* Content at bottom */}
        <div className="relative z-10 flex flex-col justify-end flex-1 px-6 md:px-12 pb-16">

          <p className="text-[10px] tracking-[0.3em] text-white/30 mb-6 animate-reveal-fade animate-delay-200">
            CONTACT
          </p>

          {/* Word-by-word clip reveal */}
          <h1
            className="font-display font-light leading-[0.9] tracking-tight
                       text-[12vw] sm:text-[9vw] md:text-[7.5vw] lg:text-[6.5vw]"
            aria-label="Get in touch."
          >
            {HEADING_WORDS.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden leading-[1.1] mr-[0.22em] last:mr-0">
                <span
                  className="inline-block animate-char-reveal"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-8">
            <div className="h-px w-12 bg-white/20 animate-draw-line animate-delay-500" />
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-screen-lg mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-0">

          {/* Info — left column */}
          <ContactInfoSection />

          {/* Form — right column with left border on desktop */}
          <div className="lg:pl-16 lg:border-l border-black/8 dark:border-white/8">
            <ContactForm />
          </div>

        </div>
      </div>

    </div>
  )
}
