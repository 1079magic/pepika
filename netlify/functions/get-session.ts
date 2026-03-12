import { Handler } from '@netlify/functions'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia' as any,
})

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  const sessionId = event.queryStringParameters?.session_id

  if (!sessionId) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'session_id is required' }) }
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: session.id,
        status: session.payment_status,
        customerEmail: session.customer_email || session.metadata?.customer_email,
        customerName: session.metadata?.customer_name,
        shippingAddress: session.metadata?.shipping_address,
        orderItems: session.metadata?.order_items,
        subtotal: session.metadata?.subtotal,
        shipping: session.metadata?.shipping_cost,
        total: session.amount_total ? (session.amount_total / 100).toFixed(2) : session.metadata?.total,
        paymentIntent: session.payment_intent,
      }),
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
