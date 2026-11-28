import crypto from 'node:crypto'
import { config, paymentsLive } from './config.js'

/** Creates an order through the Razorpay REST API, or a mock order when no keys are set. */
export async function createOrder({ amountPaise, receipt, notes }) {
  if (!paymentsLive()) {
    return { id: `order_mock_${crypto.randomBytes(8).toString('hex')}`, amount: amountPaise, currency: 'INR', mock: true }
  }
  const auth = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString('base64')
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt, notes }),
    signal: AbortSignal.timeout(15000),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.description || `Razorpay order failed (${res.status})`)
  return { id: body.id, amount: body.amount, currency: body.currency, mock: false }
}

/** HMAC-SHA256(order_id|payment_id, key_secret) must equal the signature from Checkout. */
export function verifySignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || typeof signature !== 'string') return false
  const expected = crypto.createHmac('sha256', config.razorpay.keySecret).update(`${orderId}|${paymentId}`).digest('hex')
  const a = Buffer.from(expected), b = Buffer.from(signature)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
