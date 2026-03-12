import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
    )
  }
  return stripePromise
}

// API helper to call Netlify functions
export async function createCheckoutSession(payload: {
  items: Array<{
    productId: string
    productName: string
    productSlug: string
    price: number
    quantity: number
    image: string
    personalization?: Record<string, string>
    material?: string
  }>
  customerEmail: string
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postcode: string
    country: string
    phone: string
  }
  subtotal: number
  shipping: number
  total: number
}) {
  const response = await fetch('/.netlify/functions/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || 'Failed to create checkout session')
  }

  return response.json() as Promise<{ sessionId: string; url: string }>
}

export async function getSessionDetails(sessionId: string) {
  const response = await fetch(`/.netlify/functions/get-session?session_id=${sessionId}`)
  if (!response.ok) throw new Error('Failed to get session')
  return response.json()
}
