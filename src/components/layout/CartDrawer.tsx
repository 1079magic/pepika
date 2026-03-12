'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal } = useCart()
  const FREE_SHIPPING_THRESHOLD = 100

  if (!isOpen) return null

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 animate-fade-in" onClick={closeCart} />

      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-beige-100">
          <h2 className="font-display text-2xl font-semibold text-burgundy-900">Your Cart</h2>
          <button onClick={closeCart} className="p-2 hover:bg-beige-50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-olive-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <ShoppingBag className="w-16 h-16 text-beige-200 mb-4" />
              <p className="text-lg font-display text-charcoal mb-1">Your cart is empty</p>
              <p className="text-sm text-olive-600 mb-6">Discover our personalised products</p>
              <Link href="/shop" onClick={closeCart} className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-beige-100">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4 px-6 py-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-beige-50 shrink-0 relative">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="text-sm font-medium text-charcoal hover:text-burgundy-900 transition-colors line-clamp-1">
                      {item.product.name}
                    </Link>
                    {item.personalization && Object.keys(item.personalization).length > 0 && (
                      <p className="text-xs text-olive-600 mt-0.5 line-clamp-1">
                        {Object.values(item.personalization).filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-burgundy-900 mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded border border-beige-200 flex items-center justify-center hover:bg-beige-50 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded border border-beige-200 flex items-center justify-center hover:bg-beige-50 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.product.id)} className="ml-auto p-1.5 text-mauve-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-beige-100 px-6 py-4 space-y-3">
            <div>
              <p className="text-xs text-olive-600 mb-1.5">
                {amountToFreeShipping > 0
                  ? <>Add <strong>{formatPrice(amountToFreeShipping)}</strong> more for free shipping!</>
                  : <span className="text-burgundy-900 font-medium">🎉 You qualify for free shipping!</span>
                }
              </p>
              <div className="h-1.5 bg-beige-100 rounded-full overflow-hidden">
                <div className="h-full bg-mauve-500 rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-olive-600">Subtotal ({itemCount} items)</span>
              <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center">
              Proceed to Checkout
            </Link>
            <button onClick={closeCart} className="w-full text-sm text-olive-600 hover:text-charcoal transition-colors py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
