import { Mail, Instagram, MapPin, type LucideIcon } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface ContactChannel {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}

const CONTACT_CHANNELS: ContactChannel[] = [
  {
    icon: Mail,
    label: 'EMAIL',
    value: 'info@giorgioantro.com',
    href: 'mailto:info@giorgioantro.com',
  },
  {
    icon: Instagram,
    label: 'INSTAGRAM',
    value: '@giorgioantro',
    href: 'https://www.instagram.com/giorgioantro/',
  },
  {
    icon: MapPin,
    label: 'LOCATION',
    value: 'Based worldwide, shipping globally',
  },
]

export default function ContactInfoSection() {
  return (
    <div className="space-y-14">

      <div>
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.25em] mb-10">REACH US AT</p>
        </ScrollReveal>

        <div className="space-y-8">
          {CONTACT_CHANNELS.map(({ icon: Icon, label, value, href }, i) => (
            <ScrollReveal key={label} delay={i * 90}>
              <div className="flex gap-5 group">
                <Icon
                  size={15}
                  strokeWidth={1.5}
                  className="flex-shrink-0 mt-0.5 text-black/30 dark:text-white/30 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
                />
                <div>
                  <p className="text-[9px] tracking-[0.22em] text-black/30 dark:text-white/30 mb-1.5">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm underline-reveal"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-black/55 dark:text-white/55">{value}</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ScrollReveal delay={300}>
        <div className="border-t border-black/10 dark:border-white/10 pt-10">
          <p className="text-[10px] tracking-[0.25em] mb-6">SUPPORT HOURS</p>
          <div className="space-y-2 text-sm text-black/45 dark:text-white/45 leading-relaxed">
            <p>Mon – Fri &nbsp;&nbsp;&nbsp;9:00 AM – 6:00 PM</p>
            <p>Saturday &nbsp;&nbsp;&nbsp;10:00 AM – 4:00 PM</p>
            <p>Sunday &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Closed</p>
          </div>
        </div>
      </ScrollReveal>

    </div>
  )
}
