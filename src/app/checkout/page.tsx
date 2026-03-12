'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Lock, CreditCard, Truck, Shield, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import { createCheckoutSession } from '@/lib/stripe'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface ShippingForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postcode: string
  country: string
  phone: string
}

const INITIAL_FORM: ShippingForm = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postcode: '',
  country: 'Croatia',
  phone: '',
}

const COUNTRIES = [
  'Croatia', 'Germany', 'Austria', 'Slovenia', 'Italy', 'Hungary',
  'Czech Republic', 'Slovakia', 'Poland', 'France', 'Netherlands',
  'Belgium', 'Switzerland', 'United Kingdom', 'Spain', 'Portugal',
  'Sweden', 'Denmark', 'Norway', 'Finland', 'Ireland', 'Other EU',
]

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, itemCount, getItemKey } = useCart()
  const [form, setForm] = useState<ShippingForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingForm, string>>>({})
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const updateField = (field: keyof ShippingForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    setGlobalError('')
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ShippingForm, string>> = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required'
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.lastName.trim()) errs.lastName = 'Required'
    if (!form.address.trim()) errs.address = 'Required'
    if (!form.city.trim()) errs.city = 'Required'
    if (!form.postcode.trim()) errs.postcode = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCheckout = async () => {
    if (!validate()) return

    setLoading(true)
    setGlobalError('')

    try {
      const payload = {
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productSlug: item.product.slug,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          personalization: item.personalization,
          material: item.product.material,
        })),
        customerEmail: form.email,
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          postcode: form.postcode,
          country: form.country,
          phone: form.phone,
        },
        subtotal,
        shipping,
        total,
      }

      if (paymentMethod === 'stripe') {
        const { url } = await createCheckoutSession(payload)
        if (url) {
          window.location.href = url
        } else {
          throw new Error('No checkout URL returned')
        }
      } else {
        // PayPal — redirect to a placeholder for now
        setGlobalError('PayPal integration coming soon. Please use card payment.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setGlobalError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputClass = (field: keyof ShippingForm) =>
    `w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-beige-200 focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100'
    }`

  if (items.length === 0) {
    return (
      <div className="text-center py-24" style={{ backgroundColor: '#faf7f4' }}>
        <h1 className="font-display text-3xl font-bold text-charcoal mb-4">Your cart is empty</h1>
        <p className="text-olive-600 mb-6">Add some products before checking out.</p>
        <Link href="/shop" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <section style={{ backgroundColor: '#faf7f4' }} className="min-h-screen">
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal">Checkout</h1>
            <div className="hidden sm:flex items-center gap-2 text-xs text-mauve-400">
              <Lock className="w-3.5 h-3.5" /> Secure 256-bit SSL
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* ── LEFT: Form ── */}
            <div className="space-y-6">

              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige-100/50">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-4">Contact Information</h2>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Email address <span className="text-burgundy-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="your@email.com"
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                  <p className="text-xs text-mauve-400 mt-1.5">Order confirmation and shipping updates will be sent here.</p>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige-100/50">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-mauve-500" /> Shipping Address
                </h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">First Name <span className="text-burgundy-600">*</span></label>
                      <input type="text" value={form.firstName} onChange={e => updateField('firstName', e.target.value)} className={inputClass('firstName')} />
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Last Name <span className="text-burgundy-600">*</span></label>
                      <input type="text" value={form.lastName} onChange={e => updateField('lastName', e.target.value)} className={inputClass('lastName')} />
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Street Address <span className="text-burgundy-600">*</span></label>
                    <input type="text" value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="123 Main Street, Apt 4" className={inputClass('address')} />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">City <span className="text-burgundy-600">*</span></label>
                      <input type="text" value={form.city} onChange={e => updateField('city', e.target.value)} className={inputClass('city')} />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Postcode <span className="text-burgundy-600">*</span></label>
                      <input type="text" value={form.postcode} onChange={e => updateField('postcode', e.target.value)} className={inputClass('postcode')} />
                      {errors.postcode && <p className="text-xs text-red-500 mt-1">{errors.postcode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
                      <select value={form.country} onChange={e => updateField('country', e.target.value)} className={`${inputClass('country')} bg-white`}>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Phone <span className="text-mauve-300 font-normal">(optional)</span></label>
                    <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+385 91 469 22 19" className={inputClass('phone')} />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige-100/50">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-mauve-500" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Stripe */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-mauve-500 bg-mauve-50/50'
                      : 'border-beige-200 hover:border-beige-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      paymentMethod === 'stripe' ? 'border-mauve-500' : 'border-beige-300'
                    }`}>
                      {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-mauve-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">Credit / Debit Card</p>
                      <p className="text-xs text-mauve-400">Visa, Mastercard, AMEX — via Stripe</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-mauve-400">
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-[10px]">VISA</span>
                      <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded font-bold text-[10px]">MC</span>
                    </div>
                  </label>

                  {/* PayPal */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-mauve-500 bg-mauve-50/50'
                      : 'border-beige-200 hover:border-beige-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      paymentMethod === 'paypal' ? 'border-mauve-500' : 'border-beige-300'
                    }`}>
                      {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-mauve-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">PayPal</p>
                      <p className="text-xs text-mauve-400">Pay with your PayPal account</p>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold text-[10px]">PayPal</span>
                  </label>
                </div>

                <p className="flex items-center gap-2 text-xs text-mauve-400 mt-4">
                  <Lock className="w-3.5 h-3.5" /> Your payment is encrypted and processed securely.
                </p>
              </div>

              {/* Error Message */}
              {globalError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">{globalError}</p>
                    <p className="text-xs text-red-500 mt-0.5">Please try again or choose a different payment method.</p>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary w-full text-base py-4 gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                ) : (
                  <>Place Order — {formatPrice(total)} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-xs text-center text-mauve-400">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige-100/50">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-4">
                  Order Summary
                  <span className="text-sm font-body font-normal text-mauve-400 ml-2">({itemCount})</span>
                </h2>

                <div className="divide-y divide-beige-100 max-h-[400px] overflow-y-auto">
                  {items.map(item => {
                    const personEntries = item.personalization
                      ? Object.entries(item.personalization).filter(([, v]) => v)
                      : []

                    return (
                      <div key={getItemKey(item)} className="flex gap-3 py-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-beige-50 shrink-0 relative ring-1 ring-beige-100">
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-burgundy-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal truncate">{item.product.name}</p>
                          {personEntries.length > 0 && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-mauve-400 shrink-0" />
                              <p className="text-[11px] text-mauve-400 truncate">
                                {personEntries.map(([, v]) => v).join(' · ')}
                              </p>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-charcoal whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-beige-100 mt-3 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-olive-600">Subtotal</span>
                    <span className="text-charcoal">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-olive-600">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-charcoal'}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-beige-100 pt-3 mt-3">
                    <span className="text-charcoal">Total</span>
                    <span className="text-burgundy-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Lock, text: 'SSL Encrypted' },
                  { icon: Shield, text: 'Buyer Protection' },
                  { icon: Truck, text: 'Tracked Shipping' },
                ].map(item => (
                  <div key={item.text} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-white border border-beige-100/50">
                    <item.icon className="w-4 h-4 text-mauve-500" />
                    <span className="text-[10px] text-olive-600 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link href="/cart" className="block text-center text-sm text-olive-600 hover:text-burgundy-900 transition-colors">
                ← Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
