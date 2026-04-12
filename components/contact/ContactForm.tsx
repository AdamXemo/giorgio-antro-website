'use client'

import { useContactForm } from '@/hooks/useContactForm'

const INPUT_CLASS =
  'w-full px-0 py-3.5 bg-transparent border-b border-black/15 dark:border-white/15 focus:border-black dark:focus:border-white outline-none text-sm transition-colors placeholder:text-black/25 dark:placeholder:text-white/25'

export default function ContactForm() {
  const { formData, sending, handleChange, handleSubmit } = useContactForm()

  return (
    <div>
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
            className={INPUT_CLASS}
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
            className={INPUT_CLASS}
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
            className={INPUT_CLASS}
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
            className={`${INPUT_CLASS} resize-none`}
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
  )
}
