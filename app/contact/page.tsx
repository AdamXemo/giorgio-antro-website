import ContactForm from '@/components/contact/ContactForm'
import ContactInfoSection from '@/components/contact/ContactInfoSection'

export default function ContactPage() {
  return (
    <div className="pt-[73px]">

      {/* ── Hero ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-black text-white">
        <div className="max-w-screen-lg mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-white/25 mb-6">CONTACT</p>
          <h1 className="font-display font-light text-5xl md:text-7xl leading-none">
            Get in touch.
          </h1>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <div className="max-w-screen-lg mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="order-2 lg:order-1">
            <ContactInfoSection />
          </div>
          <div className="order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>
      </div>

    </div>
  )
}
