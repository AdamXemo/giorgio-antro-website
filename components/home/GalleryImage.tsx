import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

interface GalleryImageProps {
  src: string
  alt: string
  /** When set, the tile becomes a link to this href. Otherwise it's decorative. */
  href?: string
  /** Responsive `sizes` hint for next/image. */
  sizes: string
  className?: string
}

/**
 * GalleryImage — a single editorial gallery tile.
 *
 * One component covers both cases in the homepage gallery:
 *  - product shots (with `href`) render as a link to the product page
 *  - decorative shots (no `href`) render as a static figure
 *
 * The image fills its wrapper, so the parent controls the box dimensions
 * (aspect ratio or fixed height).
 */
export default function GalleryImage({ src, alt, href, sizes, className = '' }: GalleryImageProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={90}
      className="object-cover object-center ease-out motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.03]"
    />
  )

  const wrapperClass = `group relative block h-full w-full overflow-hidden bg-[#f0f0f0] ${className}`

  if (href) {
    return (
      <Link
        href={href}
        aria-label={alt}
        className={`${wrapperClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2`}
      >
        {image}
      </Link>
    )
  }

  return (
    <div className={wrapperClass} aria-hidden>
      {image}
    </div>
  )
}

/** Shared row/tile wrapper kept here so HomeGallery composition stays declarative. */
export function GalleryRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`grid ${className}`}>{children}</div>
}
