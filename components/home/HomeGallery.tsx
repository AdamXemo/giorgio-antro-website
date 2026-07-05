import { mainProduct } from '@/data/products'
import ScrollReveal from '@/components/ui/ScrollReveal'
import GalleryImage, { GalleryRow } from './GalleryImage'

const productHref = `/product/${mainProduct.id}`
const src = (n: string) => `/home/collage/${n}.jpg`

// Reading order matches the prototype (left→right, top→bottom).
const ROW_TOP = ['07', '05', '06'] // product shots — linked
const ROW_BOTTOM = ['03', '01', '02'] // editorial shots — decorative

const COL_SIZES = '(min-width: 640px) 33vw, 100vw'
const FEATURE_WIDE_SIZES = '(min-width: 1024px) 66vw, 100vw'
const FEATURE_NARROW_SIZES = '(min-width: 1024px) 33vw, 100vw'

/**
 * HomeGallery — editorial image grid beneath the hero.
 *
 * Three rows per the client prototype:
 *   1. three equal product shots
 *   2. a feature row: one wide (2/3) product shot + one narrow (1/3)
 *   3. three equal editorial ("other") shots
 *
 * Product tiles link to the product page; editorial tiles are decorative.
 * Each tile reveals on scroll with a small per-tile stagger.
 */
export default function HomeGallery() {
  return (
    <section>
      {/* Row 1 — three product shots */}
      <GalleryRow className="grid-cols-1 sm:grid-cols-3">
        {ROW_TOP.map((n, i) => (
          <ScrollReveal key={n} delay={i * 80} className="aspect-[4/5]">
            <GalleryImage src={src(n)} alt={mainProduct.name} href={productHref} sizes={COL_SIZES} />
          </ScrollReveal>
        ))}
      </GalleryRow>

      {/* Row 2 — feature row: 08 wide (2/3) + 04 (1/3), equal height on desktop */}
      <GalleryRow className="grid-cols-1 lg:grid-cols-3 lg:h-[70vh]">
        <ScrollReveal className="aspect-[4/5] lg:aspect-auto lg:h-full lg:col-span-2">
          <GalleryImage src={src('08')} alt={mainProduct.name} href={productHref} sizes={FEATURE_WIDE_SIZES} />
        </ScrollReveal>
        <ScrollReveal delay={80} className="aspect-[4/5] lg:aspect-auto lg:h-full">
          <GalleryImage src={src('04')} alt={mainProduct.name} href={productHref} sizes={FEATURE_NARROW_SIZES} />
        </ScrollReveal>
      </GalleryRow>

      {/* Row 3 — three editorial shots (decorative) */}
      <GalleryRow className="grid-cols-1 sm:grid-cols-3">
        {ROW_BOTTOM.map((n, i) => (
          <ScrollReveal key={n} delay={i * 80} className="aspect-[4/5]">
            <GalleryImage src={src(n)} alt="" sizes={COL_SIZES} />
          </ScrollReveal>
        ))}
      </GalleryRow>
    </section>
  )
}
