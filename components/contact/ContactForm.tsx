'use client'

import { useContactForm } from '@/hooks/useContactForm'

// No border on the input itself — handled by .input-field-wrapper pseudo-elements
const INPUT_CLASS =
  'w-full px-0 py-3.5 bg-transparent outline-none text-sm ' +
  'placeholder:text-black/25'

const FIELDS = [
  { id: 'name',    type: 'text',  placeholder: 'Name',    delay: '0.05s' },
  { id: 'email',   type: 'email', placeholder: 'Email',   delay: '0.12s' },
  { id: 'subject', type: 'text',  placeholder: 'Subject', delay: '0.19s' },
] as const

export default function ContactForm() {
  const { formData, sending, handleChange, handleSubmit } = useContactForm()

  return (
    <div>
      <p className="text-[10px] tracking-[0.25em] mb-10 animate-reveal-fade animate-delay-100">
        SEND A MESSAGE
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Single-line fields */}
        {FIELDS.map(({ id, type, placeholder, delay }) => (
          <div
            key={id}
            className="input-field-wrapper animate-reveal-up"
            style={{ animationDelay: delay }}
          >
            <label htmlFor={id} className="sr-only">{placeholder}</label>
            <input
              type={type}
              id={id}
              name={id}
              value={formData[id]}
              onChange={handleChange}
              required
              placeholder={placeholder}
              className={INPUT_CLASS}
            />
          </div>
        ))}

        {/* Textarea */}
        <div
          className="input-field-wrapper animate-reveal-up"
          style={{ animationDelay: '0.26s' }}
        >
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

        {/* Submit — same wipe-fill as all brand buttons */}
        <div className="animate-reveal-fade animate-delay-400">
          <button
            type="submit"
            disabled={sending}
            className="relative w-full overflow-hidden py-4 text-[10px] tracking-[0.28em]
                       bg-black text-white border border-black
                       hover:text-black


                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors duration-300 group"
          >
            <span className="relative z-10">
              {sending ? 'SENDING...' : 'SEND MESSAGE'}
            </span>
            {!sending && (
              <span
                className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
