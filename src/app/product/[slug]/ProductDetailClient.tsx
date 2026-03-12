'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Check, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import ProductGrid from '@/components/product/ProductGrid'
import type { Product, Category, Review } from '@/lib/types'

interface Props {
  product: Product
  category: Category | null
  related: Product[]
  reviews: Review[]
}

export default function ProductDetailClient({ product, category, related, reviews }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [personalization, setPersonalization] = useState<Record<string, string>>({})
  const { addItem } = useCart()

  const handlePersonalizationChange = (label: string, value: string) => {
    setPersonalization(prev => ({ ...prev, [label]: value }))
  }

  const handleAddToCart = () => addItem(product, quantity, personalization)

  const allRequiredFilled = product.personalizationOptions
    ? product.personalizationOptions.filter(o => o.required).every(o => personalization[o.label]?.trim())
    : true

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-beige-200 text-charcoal placeholder:text-mauve-300 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all"

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-beige-100">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-olive-600 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-burgundy-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-mauve-300" />
            <Link href="/shop" className="hover:text-burgundy-900 transition-colors">Shop</Link>
            {category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-mauve-300" />
                <Link href={`/category/${category.slug}`} className="hover:text-burgundy-900 transition-colors">{category.name}</Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-mauve-300" />
            <span className="text-charcoal font-medium truncate">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
      <section style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-beige-100">
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-burgundy-900 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" priority />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-mauve-500 shadow-md' : 'border-transparent hover:border-beige-300'}`}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">{product.name}</h1>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-mauve-500 text-mauve-500' : 'text-beige-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-olive-600">{product.rating} ({product.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-burgundy-900">{formatPrice(product.price)}</span>
                {product.originalPrice && <span className="text-lg text-mauve-400 line-through">{formatPrice(product.originalPrice)}</span>}
              </div>

              <p className="text-olive-600 leading-relaxed">{product.shortDescription}</p>

              {/* Personalization */}
              {product.personalizable && product.personalizationOptions && (
                <div className="space-y-4 p-5 bg-white rounded-xl border border-beige-100">
                  <h3 className="font-display text-lg font-semibold text-charcoal flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-mauve-500" /> Personalise Your Product
                  </h3>
                  {product.personalizationOptions.map(option => (
                    <div key={option.label}>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        {option.label} {option.required && <span className="text-burgundy-600">*</span>}
                      </label>
                      {option.type === 'text' && (
                        <input type="text" placeholder={option.placeholder} maxLength={option.maxLength} value={personalization[option.label] || ''} onChange={e => handlePersonalizationChange(option.label, e.target.value)} className={inputClass} />
                      )}
                      {option.type === 'select' && option.options && (
                        <select value={personalization[option.label] || ''} onChange={e => handlePersonalizationChange(option.label, e.target.value)} className={`${inputClass} bg-white`}>
                          <option value="">Choose…</option>
                          {option.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      )}
                      {option.type === 'color' && option.options && (
                        <div className="flex flex-wrap gap-2">
                          {option.options.map(opt => (
                            <button key={opt} onClick={() => handlePersonalizationChange(option.label, opt)} className={`px-3 py-1.5 text-sm rounded-full border transition-all ${personalization[option.label] === opt ? 'border-mauve-500 bg-mauve-50 text-burgundy-900 font-medium' : 'border-beige-200 text-olive-600 hover:border-mauve-300'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-beige-200 rounded-lg bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 hover:bg-beige-50 transition-colors rounded-l-lg"><Minus className="w-4 h-4" /></button>
                  <span className="px-4 py-2.5 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2.5 hover:bg-beige-50 transition-colors rounded-r-lg"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={handleAddToCart} disabled={!allRequiredFilled} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  Add to Cart — {formatPrice(product.price * quantity)}
                </button>
                <button className="p-3 border border-beige-200 rounded-lg hover:bg-beige-50 hover:text-burgundy-900 transition-colors bg-white" aria-label="Wishlist">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, text: `Delivery in ${product.deliveryDays || 5} days` },
                  { icon: Shield, text: 'Secure checkout' },
                  { icon: RotateCcw, text: '14-day returns' },
                ].map(item => (
                  <div key={item.text} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-blush-100/50">
                    <item.icon className="w-4 h-4 text-mauve-500" />
                    <span className="text-xs text-olive-600">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              {product.features && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider font-body">Features</h3>
                  <ul className="space-y-1.5">
                    {product.features.map(feat => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-olive-600"><Check className="w-4 h-4 text-mauve-500 shrink-0" /> {feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs */}
              {(product.material || product.dimensions) && (
                <div className="border-t border-beige-100 pt-4 space-y-2">
                  {product.material && <div className="flex justify-between text-sm"><span className="text-olive-600">Material</span><span className="text-charcoal font-medium">{product.material}</span></div>}
                  {product.dimensions && <div className="flex justify-between text-sm"><span className="text-olive-600">Dimensions</span><span className="text-charcoal font-medium">{product.dimensions}</span></div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white border-t border-beige-100">
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-charcoal mb-4">About This Product</h2>
            <div className="text-olive-600 leading-relaxed whitespace-pre-line">{product.description}</div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-beige-100" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-beige-100/50">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-mauve-500 text-mauve-500" />)}
                </div>
                <p className="text-sm text-olive-600 leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <p className="text-sm font-medium text-charcoal">{review.author}</p>
                {review.verified && <p className="text-xs text-mauve-400">Verified Purchase</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white border-t border-beige-100">
          <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
            <h2 className="font-display text-3xl font-bold text-charcoal mb-8">You May Also Like</h2>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  )
}
