import { Star, Check, Truck, Shield, RotateCcw, Sparkles } from 'lucide-react'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="space-y-5">
      {/* Title + Rating */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-[18px] h-[18px] ${
                  i < Math.round(product.rating) ? 'fill-mauve-500 text-mauve-500' : 'text-beige-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-olive-600">
            <span className="font-semibold text-charcoal">{product.rating}</span> · {product.reviewCount} reviews
          </span>
          {product.personalizable && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-mauve-50 text-burgundy-900 text-xs font-semibold rounded-full border border-mauve-200">
              <Sparkles className="w-3 h-3" /> Personalise
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-burgundy-900">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-mauve-400 line-through">{formatPrice(product.originalPrice)}</span>
            <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">
              −{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      <p className="text-olive-600 leading-relaxed text-[15px]">{product.shortDescription}</p>

      {/* Divider */}
      <div className="border-t border-beige-100" />

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Truck, text: `${product.deliveryDays || 5}-day delivery` },
          { icon: Shield, text: 'Secure checkout' },
          { icon: RotateCcw, text: '14-day returns' },
        ].map(item => (
          <div key={item.text} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-beige-50/70 border border-beige-100/50">
            <item.icon className="w-4 h-4 text-mauve-500" />
            <span className="text-[11px] text-olive-600 font-medium leading-tight">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold text-charcoal uppercase tracking-widest font-body">
            Features
          </h3>
          <ul className="space-y-1.5">
            {product.features.map(feat => (
              <li key={feat} className="flex items-start gap-2 text-sm text-olive-600">
                <Check className="w-4 h-4 text-mauve-500 shrink-0 mt-0.5" /> {feat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specs Table */}
      {(product.material || product.dimensions) && (
        <div className="border-t border-beige-100 pt-4 space-y-2.5">
          <h3 className="text-xs font-semibold text-charcoal uppercase tracking-widest font-body">
            Specifications
          </h3>
          <div className="bg-beige-50/50 rounded-xl overflow-hidden">
            {product.material && (
              <div className="flex justify-between text-sm px-4 py-2.5 border-b border-beige-100/50">
                <span className="text-olive-600">Material</span>
                <span className="text-charcoal font-medium">{product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between text-sm px-4 py-2.5">
                <span className="text-olive-600">Dimensions</span>
                <span className="text-charcoal font-medium">{product.dimensions}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
