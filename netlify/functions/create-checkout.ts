import { Handler } from '@netlify/functions'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia' as any,
})

interface CartItemPayload {
  productId: string
  productName: string
  productSlug: string
  price: number
  quantity: number
  image: string
  personalization?: Record<string, string>
  material?: string
}

interface CheckoutPayload {
  items: CartItemPayload[]
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
}

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const payload: CheckoutPayload = JSON.parse(event.body || '{}')

    if (!payload.items || payload.items.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Cart is empty' }) }
    }

    if (!payload.customerEmail) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email is required' }) }
    }

    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888'

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = payload.items.map(item => {
      const personText = item.personalization
        ? Object.entries(item.personalization).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')
        : ''

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.productName,
            description: personText ? `Personalisation: ${personText}` : undefined,
            images: item.image.startsWith('http') ? [item.image] : [`${siteUrl}${item.image}`],
            metadata: {
              product_id: item.productId,
              product_slug: item.productSlug,
              personalization: personText || 'none',
              material: item.material || '',
            },
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      }
    })

    // Add shipping as a line item if not free
    if (payload.shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Shipping',
            description: 'Standard delivery',
          },
          unit_amount: Math.round(payload.shipping * 100),
        },
        quantity: 1,
      })
    }

    // Build order metadata for email notification
    const orderItems = payload.items.map(item => {
      const personText = item.personalization
        ? Object.entries(item.personalization).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' | ')
        : 'N/A'
      return `${item.productName} x${item.quantity} (€${item.price.toFixed(2)}) [${personText}]`
    }).join(' ;; ')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: payload.customerEmail,
      line_items: lineItems,
      metadata: {
        customer_email: payload.customerEmail,
        customer_name: `${payload.shippingAddress.firstName} ${payload.shippingAddress.lastName}`,
        shipping_address: `${payload.shippingAddress.address}, ${payload.shippingAddress.postcode} ${payload.shippingAddress.city}, ${payload.shippingAddress.country}`,
        shipping_phone: payload.shippingAddress.phone || '',
        order_items: orderItems.substring(0, 500), // Stripe metadata limit is 500 chars
        subtotal: payload.subtotal.toFixed(2),
        shipping_cost: payload.shipping.toFixed(2),
        total: payload.total.toFixed(2),
      },
      success_url: `${siteUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id, url: session.url }),
    }
  } catch (error: any) {
    console.error('Stripe error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    }
  }
}
