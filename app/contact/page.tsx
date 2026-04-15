import ContactForm from '@/components/contact/ContactForm'
import ContactInfoSection from '@/components/contact/ContactInfoSection'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col pt-[73px]">
      <div className="mx-auto flex w-full max-w-screen-lg flex-1 flex-col px-6 py-16 md:px-12 md:py-24">
        {/* Heading */}
        <ScrollReveal>
          <div className="mb-16 md:mb-20">
            <p className="mb-4 text-[10px] tracking-[0.3em] text-black/35 dark:text-white/35">
              CONTACT
            </p>
            <h1 className="font-display text-4xl font-light md:text-5xl">Get in Touch</h1>
          </div>
        </ScrollReveal>

        {/* Info + Form */}
        <div className="grid flex-1 grid-cols-1 gap-16 lg:grid-cols-[2fr_3fr] lg:gap-0">
          <ContactInfoSection />
          <div className="border-black/8 dark:border-white/8 lg:border-l lg:pl-16">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
