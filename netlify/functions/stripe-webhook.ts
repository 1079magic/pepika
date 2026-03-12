import { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia' as any,
})

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const OWNER_EMAIL = 'egon.hadzisejdic1@gmail.com'

function buildOrderEmailHtml(session: Stripe.Checkout.Session): string {
  const meta = session.metadata || {}
  const items = (meta.order_items || '').split(' ;; ').filter(Boolean)
  const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : meta.total || '0.00'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #faf7f4; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    
    <div style="background: #632B30; padding: 24px 32px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🎉 New Order Received!</h1>
      <p style="color: #F2D1C9; margin: 8px 0 0; font-size: 14px;">Pepika — Order Notification</p>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: #632B30; margin: 0 0 16px; font-size: 18px;">Customer Details</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr><td style="padding: 6px 0; color: #6B683B; font-size: 14px;">Name:</td><td style="padding: 6px 0; font-weight: 600; font-size: 14px;">${meta.customer_name || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B683B; font-size: 14px;">Email:</td><td style="padding: 6px 0; font-weight: 600; font-size: 14px;">${meta.customer_email || session.customer_email || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B683B; font-size: 14px;">Phone:</td><td style="padding: 6px 0; font-weight: 600; font-size: 14px;">${meta.shipping_phone || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B683B; font-size: 14px;">Address:</td><td style="padding: 6px 0; font-weight: 600; font-size: 14px;">${meta.shipping_address || 'N/A'}</td></tr>
      </table>

      <h2 style="color: #632B30; margin: 0 0 16px; font-size: 18px;">Order Items</h2>
      <div style="background: #faf7f4; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        ${items.map(item => `
          <div style="padding: 8px 0; border-bottom: 1px solid #E8D5C4; font-size: 14px;">
            ${item}
          </div>
        `).join('')}
      </div>

      <h2 style="color: #632B30; margin: 0 0 16px; font-size: 18px;">Payment Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #6B683B; font-size: 14px;">Subtotal:</td><td style="padding: 6px 0; text-align: right; font-size: 14px;">€${meta.subtotal || '0.00'}</td></tr>
        <tr><td style="padding: 6px 0; color: #6B683B; font-size: 14px;">Shipping:</td><td style="padding: 6px 0; text-align: right; font-size: 14px;">€${meta.shipping_cost === '0.00' ? 'Free' : meta.shipping_cost || '0.00'}</td></tr>
        <tr style="border-top: 2px solid #632B30;"><td style="padding: 12px 0; color: #632B30; font-weight: 700; font-size: 18px;">Total Paid:</td><td style="padding: 12px 0; text-align: right; color: #632B30; font-weight: 700; font-size: 18px;">€${amountTotal}</td></tr>
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #F2D1C9; border-radius: 12px; text-align: center;">
        <p style="margin: 0; color: #632B30; font-size: 14px; font-weight: 600;">Payment ID: ${session.payment_intent || session.id}</p>
        <p style="margin: 4px 0 0; color: #632B30; font-size: 12px;">Bank: HR3525000093207918537 — Egon Hadžisejdić</p>
      </div>
    </div>

    <div style="background: #6B683B; padding: 16px 32px; text-align: center;">
      <p style="color: #E8D5C4; margin: 0; font-size: 12px;">Pepika — Premium Personalised Products · Osijek, Croatia</p>
    </div>
  </div>
</body>
</html>`
}

function buildOrderEmailText(session: Stripe.Checkout.Session): string {
  const meta = session.metadata || {}
  const items = (meta.order_items || '').split(' ;; ').filter(Boolean)
  const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : meta.total || '0.00'

  return `
NEW ORDER RECEIVED — Pepika

Customer: ${meta.customer_name || 'N/A'}
Email: ${meta.customer_email || session.customer_email || 'N/A'}
Phone: ${meta.shipping_phone || 'N/A'}
Address: ${meta.shipping_address || 'N/A'}

ORDER ITEMS:
${items.map(item => `  • ${item}`).join('\n')}

Subtotal: €${meta.subtotal || '0.00'}
Shipping: €${meta.shipping_cost === '0.00' ? 'Free' : meta.shipping_cost || '0.00'}
TOTAL PAID: €${amountTotal}

Payment ID: ${session.payment_intent || session.id}
Stripe Dashboard: https://dashboard.stripe.com/payments/${session.payment_intent}
`
}

async function sendOrderEmail(session: Stripe.Checkout.Session) {
  // Use Gmail SMTP, Mailgun, or any SMTP provider
  // Configure via env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  })

  const meta = session.metadata || {}
  const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : meta.total || '0.00'

  await transporter.sendMail({
    from: `"Pepika Orders" <${process.env.SMTP_USER || 'noreply@pepika.com'}>`,
    to: OWNER_EMAIL,
    subject: `🎉 New Order €${amountTotal} — ${meta.customer_name || 'Customer'}`,
    text: buildOrderEmailText(session),
    html: buildOrderEmailHtml(session),
  })

  // Also send confirmation to the customer
  const customerEmail = meta.customer_email || session.customer_email
  if (customerEmail) {
    await transporter.sendMail({
      from: `"Pepika" <${process.env.SMTP_USER || 'noreply@pepika.com'}>`,
      to: customerEmail,
      subject: `Order Confirmed — Pepika #${(session.payment_intent as string || session.id).slice(-8).toUpperCase()}`,
      text: `Thank you for your order!\n\nWe've received your payment of €${amountTotal} and your personalised products are being prepared.\n\nYou'll receive shipping updates by email.\n\nPepika Team`,
      html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
  <h1 style="color: #632B30; font-size: 24px;">Thank you for your order!</h1>
  <p style="color: #6B683B; line-height: 1.6;">We've received your payment of <strong>€${amountTotal}</strong> and your personalised products are being carefully crafted in our workshop.</p>
  <p style="color: #6B683B; line-height: 1.6;">You'll receive shipping updates by email.</p>
  <p style="color: #A67C89; margin-top: 24px;">With love, <br><strong style="color: #632B30;">The Pepika Team</strong></p>
</div>`,
    })
  }
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const sig = event.headers['stripe-signature']
  let stripeEvent: Stripe.Event

  try {
    if (WEBHOOK_SECRET && sig) {
      stripeEvent = stripe.webhooks.constructEvent(event.body || '', sig, WEBHOOK_SECRET)
    } else {
      // Fallback for development without webhook signing
      stripeEvent = JSON.parse(event.body || '{}')
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid signature' }) }
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session

    console.log('Payment successful:', session.id)
    console.log('Amount:', session.amount_total)
    console.log('Customer:', session.customer_email)

    // Send order email notification
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await sendOrderEmail(session)
        console.log('Order email sent to:', OWNER_EMAIL)
      } else {
        console.log('SMTP not configured — skipping email. Order details:', JSON.stringify(session.metadata))
      }
    } catch (emailError: any) {
      console.error('Failed to send order email:', emailError.message)
      // Don't fail the webhook — payment was still successful
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ received: true }) }
}
