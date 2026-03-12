'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  name: string
  badge?: string
}

export default function ProductGallery({ images, name, badge }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const navigate = useCallback((direction: 'prev' | 'next') => {
    setSelected(prev => {
      if (direction === 'next') return prev < images.length - 1 ? prev + 1 : 0
      return prev > 0 ? prev - 1 : images.length - 1
    })
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') navigate('next')
      if (e.key === 'ArrowLeft') navigate('prev')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, navigate])

  const badgeMap: Record<string, string> = {
    bestseller: 'bg-burgundy-900 text-white',
    new: 'bg-mauve-500 text-white',
    sale: 'bg-red-500 text-white',
    limited: 'bg-olive-600 text-white',
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative group">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-beige-100">
            {badge && (
              <span className={cn(
                'absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-semibold rounded-full uppercase tracking-widest',
                badgeMap[badge] || 'bg-burgundy-900 text-white'
              )}>
                {badge}
              </span>
            )}
            <Image
              src={images[selected]}
              alt={`${name} — image ${selected + 1}`}
              fill
              className="object-cover transition-transform duration-300"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Zoom button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-md"
              aria-label="Zoom image"
            >
              <ZoomIn className="w-5 h-5 text-burgundy-900" />
            </button>

            {/* Navigation arrows on main image */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigate('prev')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-charcoal" />
                </button>
                <button
                  onClick={() => navigate('next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-charcoal" />
                </button>
              </>
            )}
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 px-2.5 py-1 bg-charcoal/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              {selected + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2.5">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={cn(
                  'relative w-[72px] h-[72px] rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0',
                  selected === i
                    ? 'border-mauve-500 shadow-md ring-2 ring-mauve-200'
                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-beige-300'
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="72px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-fade-in" onClick={() => setLightboxOpen(false)}>
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selected + 1} / {images.length}
          </div>

          {/* Image */}
          <div className="relative w-full max-w-4xl aspect-square mx-4" onClick={e => e.stopPropagation()}>
            <Image
              src={images[selected]}
              alt={`${name} — image ${selected + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('prev') }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('next') }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" onClick={e => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={cn(
                    'relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all',
                    selected === i
                      ? 'border-white shadow-lg'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
