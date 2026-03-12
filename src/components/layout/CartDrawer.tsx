'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getItemKey, itemCount, subtotal, shipping, total } = useCart()
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
          <h2 className="font-display text-2xl font-semibold text-burgundy-900">
            Your Cart
            {itemCount > 0 && (
              <span className="text-sm font-body font-normal text-mauve-400 ml-2">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-beige-50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-olive-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-2xl bg-beige-50 flex items-center justify-center mb-5">
                <ShoppingBag className="w-10 h-10 text-beige-200" />
              </div>
              <p className="text-xl font-display font-semibold text-charcoal mb-1">Your cart is empty</p>
              <p className="text-sm text-olive-600 mb-6">Discover our personalised products</p>
              <Link href="/shop" onClick={closeCart} className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-beige-100">
              {items.map(item => {
                const key = getItemKey(item)
                const personValues = item.personalization
                  ? Object.entries(item.personalization).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)
                  : []

                return (
                  <div key={key} className="flex gap-4 px-6 py-4">
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-beige-50 shrink-0 relative ring-1 ring-beige-100"
                    >
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-charcoal hover:text-burgundy-900 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>

                      {/* Personalization details */}
                      {personValues.length > 0 && (
                        <div className="flex items-start gap-1 mt-0.5">
                          <Sparkles className="w-3 h-3 text-mauve-400 mt-0.5 shrink-0" />
                          <p className="text-[11px] text-mauve-500 line-clamp-2 leading-tight">
                            {personValues.join(' · ')}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-semibold text-burgundy-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-mauve-400">
                            {formatPrice(item.product.price)} each
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(key, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-beige-200 flex items-center justify-center hover:bg-beige-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(key, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-beige-200 flex items-center justify-center hover:bg-beige-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(key)}
                          className="ml-auto p-1.5 text-mauve-300 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-beige-100 px-6 py-4 space-y-3">
            {/* Free shipping progress */}
            <div>
              <p className="text-xs text-olive-600 mb-1.5">
                {amountToFreeShipping > 0
                  ? <>Add <strong className="text-burgundy-900">{formatPrice(amountToFreeShipping)}</strong> more for free shipping!</>
                  : <span className="text-burgundy-900 font-medium">🎉 You qualify for free shipping!</span>
                }
              </p>
              <div className="h-1.5 bg-beige-100 rounded-full overflow-hidden">
                <div className="h-full bg-mauve-500 rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-olive-600">Subtotal</span>
                <span className="text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-olive-600">Shipping</span>
                <span className="text-charcoal">{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-beige-100">
                <span className="text-charcoal">Total</span>
                <span className="text-burgundy-900">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center">
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full text-center text-sm text-olive-600 hover:text-burgundy-900 transition-colors py-1 font-medium"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
