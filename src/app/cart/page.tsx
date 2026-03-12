'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Sparkles, Truck, Shield, Tag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getItemKey, itemCount, subtotal, shipping, total } = useCart()

  const FREE_SHIPPING_THRESHOLD = 100
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />

      <section className="min-h-[60vh]" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal">
              Shopping Cart
              {itemCount > 0 && (
                <span className="text-lg font-body font-normal text-mauve-400 ml-3">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-mauve-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            /* ═══ EMPTY STATE ═══ */
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-2xl bg-beige-50 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-beige-200" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">Your cart is empty</h2>
              <p className="text-olive-600 mb-8 max-w-sm mx-auto">
                Looks like you haven&apos;t added any personalised products yet.
              </p>
              <Link href="/shop" className="btn-primary gap-2">
                <ShoppingBag className="w-4 h-4" /> Browse Products
              </Link>
            </div>
          ) : (
            /* ═══ CART CONTENT ═══ */
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">

              {/* ── Cart Items ── */}
              <div className="space-y-4">
                {/* Desktop table header */}
                <div className="hidden md:grid grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-5 py-3 text-xs uppercase tracking-widest text-mauve-400 font-medium border-b border-beige-100">
                  <span>Product</span>
                  <span className="text-center">Price</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                  <span />
                </div>

                {items.map(item => {
                  const key = getItemKey(item)
                  const personEntries = item.personalization
                    ? Object.entries(item.personalization).filter(([, v]) => v)
                    : []

                  return (
                    <div
                      key={key}
                      className="bg-white rounded-2xl shadow-sm border border-beige-100/50 p-5 md:grid md:grid-cols-[1fr_120px_140px_100px_40px] md:gap-4 md:items-center"
                    >
                      {/* Product Info */}
                      <div className="flex gap-4">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="w-24 h-24 md:w-20 md:h-20 rounded-xl overflow-hidden bg-beige-50 shrink-0 relative ring-1 ring-beige-100 hover:ring-mauve-300 transition-all"
                        >
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="text-sm font-medium text-charcoal hover:text-burgundy-900 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.material && (
                            <p className="text-xs text-mauve-400 mt-0.5">{item.product.material}</p>
                          )}
                          {personEntries.length > 0 && (
                            <div className="mt-1.5 space-y-0.5">
                              {personEntries.map(([label, value]) => (
                                <div key={label} className="flex items-center gap-1.5 text-[11px]">
                                  <Sparkles className="w-2.5 h-2.5 text-mauve-400 shrink-0" />
                                  <span className="text-mauve-400">{label}:</span>
                                  <span className="text-charcoal font-medium truncate">{value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price — visible on desktop */}
                      <div className="hidden md:block text-center">
                        <span className="text-sm text-charcoal">{formatPrice(item.product.price)}</span>
                        {item.product.originalPrice && (
                          <span className="block text-xs text-mauve-400 line-through">{formatPrice(item.product.originalPrice)}</span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-3 md:mt-0 md:justify-center">
                        <span className="text-xs text-mauve-400 md:hidden mr-auto">Qty:</span>
                        <button
                          onClick={() => updateQuantity(key, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-beige-200 flex items-center justify-center hover:bg-beige-50 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(key, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-beige-200 flex items-center justify-center hover:bg-beige-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="hidden md:block text-right">
                        <span className="text-sm font-bold text-burgundy-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>

                      {/* Remove */}
                      <div className="hidden md:flex justify-end">
                        <button
                          onClick={() => removeItem(key)}
                          className="p-2 text-mauve-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Mobile: price + remove row */}
                      <div className="flex items-center justify-between mt-3 md:hidden pt-3 border-t border-beige-100/50">
                        <span className="text-sm font-bold text-burgundy-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(key)}
                          className="text-xs text-mauve-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* Continue Shopping */}
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm text-olive-600 hover:text-burgundy-900 transition-colors mt-4"
                >
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
              </div>

              {/* ── Cart Summary Sidebar ── */}
              <div className="lg:sticky lg:top-24 h-fit space-y-4">

                {/* Free Shipping Progress */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-beige-100/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="w-4 h-4 text-mauve-500" />
                    <span className="text-sm font-medium text-charcoal">Free Shipping Progress</span>
                  </div>
                  <div className="h-2 bg-beige-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-mauve-400 to-mauve-500 rounded-full transition-all duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-olive-600">
                    {amountToFreeShipping > 0
                      ? <>Add <strong className="text-burgundy-900">{formatPrice(amountToFreeShipping)}</strong> more for free shipping</>
                      : <span className="text-green-600 font-medium">🎉 You qualify for free shipping!</span>
                    }
                  </p>
                </div>

                {/* Discount Code */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-beige-100/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-mauve-500" />
                    <span className="text-sm font-medium text-charcoal">Discount Code</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-beige-200 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all"
                    />
                    <button className="px-4 py-2 text-sm font-medium bg-beige-50 text-olive-600 rounded-lg border border-beige-200 hover:bg-beige-100 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-beige-100/50">
                  <h2 className="font-display text-xl font-semibold text-charcoal mb-4">Order Summary</h2>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-olive-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                      <span className="text-charcoal font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-olive-600">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-charcoal'}>
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-olive-600">Tax</span>
                      <span className="text-mauve-400 text-xs">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-beige-100 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-base font-bold text-charcoal">Total</span>
                        <span className="text-xl font-bold text-burgundy-900">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/checkout" className="btn-primary w-full text-center mt-5 py-3.5 gap-2">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Trust */}
                <div className="flex items-center justify-center gap-4 text-xs text-mauve-400 py-2">
                  <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Secure</div>
                  <div className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Fast delivery</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
