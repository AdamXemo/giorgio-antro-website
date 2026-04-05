import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm">
        <p className="font-display font-light text-[8rem] leading-none tracking-tight text-black/[0.07] mb-4">
          404
        </p>
        <p className="text-[10px] tracking-[0.25em] text-black/35 mb-4">PAGE NOT FOUND</p>
        <h1 className="font-display font-light text-2xl mb-10">
          This page doesn&apos;t exist.
        </h1>
        <Link href="/" className="btn-primary">
          BACK TO HOME
        </Link>
      </div>
    </div>
  )
}
