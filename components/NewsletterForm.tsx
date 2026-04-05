'use client'

import { toast } from 'sonner'

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success("You're on the list! We'll keep you updated.")
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form
      className="flex flex-col sm:flex-row max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        placeholder="Your email address"
        className="flex-1 px-5 py-4 border border-black text-sm outline-none placeholder:text-black/30 bg-white"
        required
      />
      <button
        type="submit"
        className="px-8 py-4 bg-black text-white text-[10px] tracking-[0.25em] border border-black hover:bg-white hover:text-black transition-colors duration-300 whitespace-nowrap"
      >
        SUBSCRIBE
      </button>
    </form>
  )
}
