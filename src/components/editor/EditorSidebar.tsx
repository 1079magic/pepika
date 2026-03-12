'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Star, Sparkles } from 'lucide-react'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface EditorSidebarProps {
  product: Product
  onAddToCart: () => void
  hasDesign: boolean
}

export default function EditorSidebar({ product, onAddToCart, hasDesign }: EditorSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-beige-100 p-4">
        <div className="flex gap-3 items-start">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-beige-50 shrink-0 relative">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-charcoal leading-tight line-clamp-2">{product.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-3 h-3 fill-mauve-500 text-mauve-500" />
              <span className="text-xs text-olive-600">{product.rating} · {product.reviewCount} reviews</span>
            </div>
            <p className="text-lg font-bold text-burgundy-900 mt-1">{formatPrice(product.price)}</p>
          </div>
        </div>
        <Link href={`/product/${product.slug}`} className="flex items-center gap-1.5 text-xs text-mauve-500 hover:text-burgundy-900 transition-colors mt-3">
          <ArrowLeft className="w-3 h-3" /> Back to product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-beige-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-mauve-500" />
          <h4 className="text-sm font-semibold text-charcoal">Your Design</h4>
        </div>
        <p className="text-xs text-olive-600 leading-relaxed">
          {hasDesign
            ? 'Your design is looking great! Continue editing or add it to your cart when ready.'
            : 'Start by adding photos or text to the canvas. Drag elements to position them exactly how you want.'}
        </p>
      </div>

      <button onClick={onAddToCart} disabled={!hasDesign}
        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-burgundy-900 text-white font-medium rounded-xl hover:bg-burgundy-950 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
        <ShoppingBag className="w-4 h-4" /> Add to Cart — {formatPrice(product.price)}
      </button>

      <div className="bg-beige-50/70 rounded-2xl border border-beige-100/50 p-4">
        <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">Tips</h4>
        <ul className="space-y-1.5 text-[11px] text-olive-600 leading-relaxed">
          <li>• Click elements to select, then drag to move</li>
          <li>• Use corner handles to resize</li>
          <li>• Double-click text to edit it</li>
          <li>• Press Delete to remove selected element</li>
          <li>• Use Export to download your design</li>
        </ul>
      </div>
    </div>
  )
}
