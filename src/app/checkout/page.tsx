'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock, CreditCard, Truck } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const { items, subtotal, itemCount } = useCart()
  const shipping = subtotal >= 100 ? 0 : 7.99
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <h1 className="font-display text-3xl font-bold text-charcoal mb-4">Your cart is empty</h1>
        <p className="text-olive-600 mb-6">Add some products before checking out.</p>
        <Link href="/shop" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-beige-200 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all"

  return (
    <section style={{ backgroundColor: '#faf7f4' }} className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-olive-600 hover:text-burgundy-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="font-display text-4xl font-bold text-charcoal mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-100/50">
              <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Contact Information</h2>
              <input type="email" placeholder="your@email.com" className={inputClass} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-100/50">
              <h2 className="font-display text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-mauve-500" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">First Name</label><input type="text" className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">Last Name</label><input type="text" className={inputClass} /></div>
                </div>
                <div><label className="block text-sm font-medium text-charcoal mb-1.5">Address</label><input type="text" className={inputClass} /></div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">City</label><input type="text" className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">Postcode</label><input type="text" className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
                    <select className={`${inputClass} bg-white`}>
                      <option>Croatia</option><option>Germany</option><option>Austria</option><option>Slovenia</option><option>Other EU</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-beige-100/50">
              <h2 className="font-display text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-mauve-500" /> Payment
              </h2>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-charcoal mb-1.5">Card Number</label><input type="text" placeholder="1234 5678 9012 3456" className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">Expiry</label><input type="text" placeholder="MM/YY" className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">CVC</label><input type="text" placeholder="123" className={inputClass} /></div>
                </div>
              </div>
              <p className="flex items-center gap-2 text-xs text-mauve-400 mt-4"><Lock className="w-3.5 h-3.5" /> Your payment information is encrypted and secure.</p>
            </div>
            <button className="btn-primary w-full text-base py-4">Place Order — {formatPrice(total)}</button>
          </div>

          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24 border border-beige-100/50">
              <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Order Summary</h2>
              <div className="divide-y divide-beige-100">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3 py-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-beige-50 shrink-0 relative">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-burgundy-900 text-white text-xs rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{item.product.name}</p>
                      {item.personalization && <p className="text-xs text-mauve-400 truncate">{Object.values(item.personalization).filter(Boolean).join(' · ')}</p>}
                    </div>
                    <span className="text-sm font-medium text-charcoal">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-beige-100 mt-3 pt-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-olive-600">Subtotal ({itemCount})</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-olive-600">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-base font-bold border-t border-beige-100 pt-3 mt-3"><span>Total</span><span className="text-burgundy-900">{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
