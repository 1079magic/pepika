'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Package, Mail, MapPin, Loader2, AlertCircle, ArrowRight, Copy, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { getSessionDetails } from '@/lib/stripe'

interface OrderDetails {
  id: string
  status: string
  customerEmail: string
  customerName: string
  shippingAddress: string
  orderItems: string
  subtotal: string
  shipping: string
  total: string
  paymentIntent: string
}

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    const fetchOrder = async () => {
      try {
        const data = await getSessionDetails(sessionId)
        setOrder(data)
        if (data.status === 'paid') clearCart()
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [sessionId, clearCart])

  const orderId = order?.paymentIntent
    ? (typeof order.paymentIntent === 'string' ? order.paymentIntent : order.id).slice(-8).toUpperCase()
    : sessionId?.slice(-8).toUpperCase() || 'PENDING'

  const handleCopy = () => {
    navigator.clipboard.writeText(`PEP-${orderId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#faf7f4' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-mauve-500 animate-spin mx-auto mb-4" />
          <p className="text-olive-600">Loading your order details…</p>
        </div>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#faf7f4' }}>
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-mauve-300 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-charcoal mb-3">No order found</h1>
          <p className="text-olive-600 mb-6">It looks like you arrived here without completing a purchase.</p>
          <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#faf7f4' }}>
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-charcoal mb-3">Something went wrong</h1>
          <p className="text-olive-600 mb-2">We couldn&apos;t load your order details.</p>
          <p className="text-xs text-mauve-400 mb-6">If payment was successful, your order is being processed. Contact hello@pepika.com</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const orderItems = order?.orderItems ? order.orderItems.split(' ;; ').filter(Boolean) : []

  return (
    <section style={{ backgroundColor: '#faf7f4' }} className="min-h-screen">
      <div className="container max-w-3xl mx-auto px-4 py-12 md:py-20">

        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 ring-4 ring-green-100">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-3">
            Thank you for your order!
          </h1>
          <p className="text-olive-600 text-lg max-w-md mx-auto">
            Your personalised products are being carefully crafted in our workshop.
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige-100/50 text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-mauve-400 font-medium mb-1">Order Number</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold text-burgundy-900 font-display tracking-wide">PEP-{orderId}</p>
            <button onClick={handleCopy} className="p-1.5 hover:bg-beige-50 rounded-lg transition-colors" title="Copy">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-mauve-400" />}
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-beige-100/50">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-mauve-500" />
              <h3 className="text-sm font-semibold text-charcoal">Contact</h3>
            </div>
            <p className="text-sm text-olive-600">{order?.customerName || 'Customer'}</p>
            <p className="text-sm text-olive-600">{order?.customerEmail || 'N/A'}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-beige-100/50">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-mauve-500" />
              <h3 className="text-sm font-semibold text-charcoal">Shipping To</h3>
            </div>
            <p className="text-sm text-olive-600">{order?.shippingAddress || 'N/A'}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-beige-100/50 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-mauve-500" />
            <h3 className="text-sm font-semibold text-charcoal">Items Ordered</h3>
          </div>
          <div className="space-y-2">
            {orderItems.length > 0 ? orderItems.map((item, i) => (
              <div key={i} className="text-sm text-olive-600 py-2 border-b border-beige-100/50 last:border-0">{item}</div>
            )) : (
              <p className="text-sm text-mauve-400">Order details are being processed.</p>
            )}
          </div>
          <div className="border-t border-beige-100 mt-4 pt-4 space-y-1.5">
            {order?.subtotal && <div className="flex justify-between text-sm"><span className="text-olive-600">Subtotal</span><span>€{order.subtotal}</span></div>}
            {order?.shipping && <div className="flex justify-between text-sm"><span className="text-olive-600">Shipping</span><span>{order.shipping === '0.00' ? <span className="text-green-600">Free</span> : `€${order.shipping}`}</span></div>}
            <div className="flex justify-between text-lg font-bold border-t border-beige-100 pt-3 mt-2">
              <span className="text-charcoal">Total Paid</span>
              <span className="text-burgundy-900">€{order?.total || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-mauve-50 rounded-2xl p-6 border border-mauve-200/50 mb-8">
          <h3 className="font-display text-lg font-semibold text-burgundy-900 mb-3">What happens next?</h3>
          <div className="space-y-3">
            {[
              'We\'ve received your order and payment.',
              'Your personalised products are being crafted in our workshop.',
              'You\'ll receive a shipping confirmation email with tracking.',
              'Your order arrives within 5–10 business days.',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-burgundy-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm text-olive-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shop" className="btn-primary gap-2">Continue Shopping <ArrowRight className="w-4 h-4" /></Link>
          <Link href="/" className="btn-outline">Back to Home</Link>
        </div>

        <p className="text-center text-xs text-mauve-400 mt-8">
          Questions? Contact <a href="mailto:hello@pepika.com" className="text-burgundy-900 hover:underline">hello@pepika.com</a>
        </p>
      </div>
    </section>
  )
}
