'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, Sparkles } from 'lucide-react'
import { Product } from '@/lib/types'
import { formatPrice, cn } from '@/lib/utils'

const badgeStyles: Record<string, string> = {
  bestseller: 'bg-burgundy-900 text-white',
  new: 'bg-mauve-500 text-white',
  sale: 'bg-red-500 text-white',
  limited: 'bg-olive-600 text-white',
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="card-base">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-beige-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.badge && (
            <span className={cn(
              'absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wider',
              badgeStyles[product.badge]
            )}>
              {product.badge}
            </span>
          )}
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-burgundy-900"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
          {product.personalizable && (
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-medium text-burgundy-900 rounded-full">
                <Sparkles className="w-3 h-3" /> Personalise this
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-medium text-sm text-charcoal group-hover:text-burgundy-900 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-mauve-500 text-mauve-500" />
            <span className="text-xs font-medium text-charcoal">{product.rating}</span>
            <span className="text-xs text-olive-600">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-burgundy-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-mauve-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
