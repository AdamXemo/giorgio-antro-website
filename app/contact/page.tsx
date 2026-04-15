import ContactForm from '@/components/contact/ContactForm'
import ContactInfoSection from '@/components/contact/ContactInfoSection'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-[73px] flex flex-col">
      <div className="flex-1 max-w-screen-lg mx-auto w-full px-6 md:px-12 py-16 md:py-24 flex flex-col">

        {/* Heading */}
        <ScrollReveal>
          <div className="mb-16 md:mb-20">
            <p className="text-[10px] tracking-[0.3em] text-black/35 dark:text-white/35 mb-4">
              CONTACT
            </p>
            <h1 className="font-display font-light text-4xl md:text-5xl">
              Contact Us
            </h1>
          </div>
        </ScrollReveal>

        {/* Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-0 flex-1">
          <ContactInfoSection />
          <div className="lg:pl-16 lg:border-l border-black/8 dark:border-white/8">
            <ContactForm />
          </div>
        </div>

      </div>
    </div>
  )
}
