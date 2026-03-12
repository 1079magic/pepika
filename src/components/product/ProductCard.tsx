'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart } from 'lucide-react'
import { Product } from '@/lib/types'
import { formatPrice, cn } from '@/lib/utils'

const badgeStyles: Record<string, string> = {
  bestseller: 'bg-brand-500 text-white',
  new: 'bg-sage-600 text-white',
  sale: 'bg-red-500 text-white',
  limited: 'bg-charcoal text-white',
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.badge && (
            <span className={cn(
              'absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide',
              badgeStyles[product.badge]
            )}>
              {product.badge}
            </span>
          )}
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-500"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
          {product.personalizable && (
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-medium text-charcoal rounded-full">
                ✨ Personalise this
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-medium text-sm text-charcoal group-hover:text-brand-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
            <span className="text-xs font-medium text-charcoal">{product.rating}</span>
            <span className="text-xs text-sage-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-charcoal">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-sage-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
