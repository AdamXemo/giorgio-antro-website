'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm">
        <p className="font-display font-light text-[8rem] leading-none tracking-tight text-black/[0.07] mb-4">
          500
        </p>
        <p className="text-[10px] tracking-[0.25em] text-black/35 mb-4">SOMETHING WENT WRONG</p>
        <h1 className="font-display font-light text-2xl mb-10">
          An unexpected error occurred.
        </h1>
        <div className="flex gap-3">
          <button onClick={reset} className="btn-primary">
            TRY AGAIN
          </button>
          <Link href="/" className="btn-ghost">
            GO HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
