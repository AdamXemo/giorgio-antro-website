'use client'

import Image from 'next/image'
import { useProductImageGallery } from '@/hooks/useProductImageGallery'

interface ProductImageSliderProps {
  mobileImages: string[]
  productName: string
}

export default function ProductImageSlider({ mobileImages, productName }: ProductImageSliderProps) {
  const total = mobileImages.length
  const {
    selectedImage,
    setSelectedImage,
    prev,
    next,
    isDragging,
    dragOffset,
    touchHandlers,
  } = useProductImageGallery(total)

  return (
    <div>
      <div
        className="relative aspect-[3/4] overflow-hidden studio-bg select-none"
        {...touchHandlers}
      >
        <div
          className="flex h-full"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(calc(-${(selectedImage * 100) / total}% + ${isDragging ? dragOffset : 0}px))`,
            transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {mobileImages.map((image, index) => (
            <div
              key={index}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / total}%` }}
            >
              <Image
                src={image}
                alt={`${productName} — view ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain object-center"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-black/40 hover:text-black hover:shadow-lg transition-all duration-200"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden>
                <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-black/40 hover:text-black hover:shadow-lg transition-all duration-200"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden>
                <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div
          className="flex justify-center items-center gap-2.5 mt-5"
          role="tablist"
          aria-label="Image navigation"
        >
          {mobileImages.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === selectedImage}
              aria-label={`Image ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={`rounded-full transition-all duration-300 ${
                index === selectedImage
                  ? 'w-2 h-2 bg-black'
                  : 'w-[7px] h-[7px] bg-black/15 hover:bg-black/35'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
