'use client'

import { useState } from 'react'
import { Mail, Instagram, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      toast.success("Message sent! We'll get back to you soon.")
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const inputClass =
    'w-full px-0 py-3.5 bg-transparent border-b border-black/15 dark:border-white/15 focus:border-black dark:focus:border-white outline-none text-sm transition-colors placeholder:text-black/25 dark:placeholder:text-white/25'

  return (
    <div className="pt-[73px]">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-black text-white">
        <div className="max-w-screen-lg mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-white/25 mb-6">CONTACT</p>
          <h1 className="font-display font-light text-5xl md:text-7xl leading-none">
            Get in touch.
          </h1>
        </div>
      </section>

      {/* ── Form + Info ────────────────────────────────────── */}
      <div className="max-w-screen-lg mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact Info */}
          <div className="order-2 lg:order-1 space-y-14">
            <div>
              <p className="text-[10px] tracking-[0.25em] mb-10">REACH US AT</p>
              <div className="space-y-8">
                {[
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
                    href: null,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-5">
                    <Icon size={15} strokeWidth={1.5} className="flex-shrink-0 mt-0.5 text-black/30 dark:text-white/30" />
                    <div>
                      <p className="text-[9px] tracking-[0.22em] text-black/30 dark:text-white/30 mb-1.5">{label}</p>
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
                ))}
              </div>
            </div>

            <div className="border-t border-black/10 dark:border-white/10 pt-10">
              <p className="text-[10px] tracking-[0.25em] mb-6">SUPPORT HOURS</p>
              <div className="space-y-2 text-sm text-black/45 dark:text-white/45 leading-relaxed">
                <p>Mon – Fri &nbsp;&nbsp;&nbsp;9:00 AM – 6:00 PM</p>
                <p>Saturday &nbsp;&nbsp;&nbsp;10:00 AM – 4:00 PM</p>
                <p>Sunday &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Closed</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="order-1 lg:order-2">
            <p className="text-[10px] tracking-[0.25em] mb-10">SEND A MESSAGE</p>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="subject" className="sr-only">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Message"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-black text-white py-4 text-[10px] tracking-[0.28em] border border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-transparent dark:hover:text-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white dark:disabled:hover:bg-white dark:disabled:hover:text-black"
              >
                {sending ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  )
}
