'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Minus, Plus, Heart, Wand2 } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

interface PersonalizationFormProps {
  product: Product
}

export default function PersonalizationForm({ product }: PersonalizationFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [personalization, setPersonalization] = useState<Record<string, string>>({})
  const { addItem } = useCart()

  const handleChange = (label: string, value: string) => {
    setPersonalization(prev => ({ ...prev, [label]: value }))
  }

  const handleAddToCart = () => {
    addItem(product, quantity, personalization)
  }

  const allRequiredFilled = product.personalizationOptions
    ? product.personalizationOptions.filter(o => o.required).every(o => personalization[o.label]?.trim())
    : true

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-beige-200 text-charcoal placeholder:text-mauve-300 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all bg-white"

  return (
    <div className="space-y-5">
      {/* Personalization Fields */}
      {product.personalizable && product.personalizationOptions && (
        <div className="space-y-4 p-5 bg-white rounded-2xl border border-beige-100 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-charcoal flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-mauve-500" /> Personalise
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-mauve-400 font-medium">
              {product.personalizationOptions.filter(o => o.required).length} required
            </span>
          </div>

          {product.personalizationOptions.map(option => (
            <div key={option.label}>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                {option.label}
                {option.required && <span className="text-burgundy-600 ml-0.5">*</span>}
                {option.maxLength && (
                  <span className="text-mauve-300 font-normal ml-2 text-xs">
                    {(personalization[option.label] || '').length}/{option.maxLength}
                  </span>
                )}
              </label>

              {option.type === 'text' && (
                <input
                  type="text"
                  placeholder={option.placeholder}
                  maxLength={option.maxLength}
                  value={personalization[option.label] || ''}
                  onChange={e => handleChange(option.label, e.target.value)}
                  className={inputClass}
                />
              )}

              {option.type === 'select' && option.options && (
                <select
                  value={personalization[option.label] || ''}
                  onChange={e => handleChange(option.label, e.target.value)}
                  className={inputClass}
                >
                  <option value="">Choose…</option>
                  {option.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {option.type === 'color' && option.options && (
                <div className="flex flex-wrap gap-2">
                  {option.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleChange(option.label, opt)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                        personalization[option.label] === opt
                          ? 'border-mauve-500 bg-mauve-50 text-burgundy-900 font-medium shadow-sm'
                          : 'border-beige-200 text-olive-600 hover:border-mauve-300 bg-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Start Personalizing CTA — links to editor */}
          <Link
            href={`/editor/${product.id}`}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-mauve-50 text-burgundy-900 font-medium rounded-xl border border-mauve-200 hover:bg-mauve-100 hover:border-mauve-300 transition-all group"
          >
            <Wand2 className="w-4 h-4 text-mauve-500 group-hover:text-burgundy-900 transition-colors" />
            Start Personalizing
          </Link>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-beige-200 rounded-xl bg-white shadow-sm">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3.5 py-3 hover:bg-beige-50 transition-colors rounded-l-xl"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-3 py-3 text-sm font-semibold min-w-[2.5rem] text-center select-none">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3.5 py-3 hover:bg-beige-50 transition-colors rounded-r-xl"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!allRequiredFilled}
          className="btn-primary flex-1 py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart — {formatPrice(product.price * quantity)}
        </button>

        <button
          className="p-3.5 border border-beige-200 rounded-xl hover:bg-beige-50 hover:text-burgundy-900 transition-colors bg-white shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Validation hint */}
      {!allRequiredFilled && product.personalizable && (
        <p className="text-xs text-mauve-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Fill in required fields above to add to cart
        </p>
      )}
    </div>
  )
}
