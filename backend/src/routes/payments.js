import crypto from 'node:crypto'
import { Router } from 'express'
import { config, paymentsLive } from '../config.js'
import { db } from '../db.js'
import { createOrder, verifySignature } from '../razorpay.js'
import { sendRegistrationEmail } from '../mailer.js'
import { publicView } from './registrations.js'

const r = Router()

r.post('/payments/order', async (req, res) => {
  const row = db.get(req.body?.registrationId)
  if (!row) return res.status(404).json({ error: 'Registration not found.' })
  if (row.status === 'COMPLETED') return res.status(409).json({ error: 'This registration is already paid.', registration: publicView(row) })
  try {
    const order = await createOrder({ amountPaise: config.fee * 100, receipt: row.id, notes: { registrationId: row.id, name: row.name, event: row.event || 'IND' } })
    await db.update(row.id, { orderId: order.id })
    res.json({
      mock: order.mock, orderId: order.id, amount: order.amount, currency: order.currency,
      keyId: order.mock ? null : config.razorpay.keyId,
      prefill: { name: row.name, email: row.email, contact: `+91${row.mobile}` },
    })
  } catch (e) {
    console.error('[payments] order failed', e)
    res.status(502).json({ error: 'Could not start the payment. Please try again.' })
  }
})

r.post('/payments/verify', async (req, res) => {
  const { registrationId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature, mock } = req.body || {}
  const row = db.get(registrationId)
  if (!row) return res.status(404).json({ error: 'Registration not found.' })
  if (row.status === 'COMPLETED') return res.json({ registration: publicView(row) })
  if (!row.orderId || row.orderId !== orderId) return res.status(400).json({ error: 'Payment does not match this registration.' })

  let pid
  if (mock) {
    if (paymentsLive()) return res.status(400).json({ error: 'Mock payments are disabled.' })
    pid = `pay_mock_${crypto.randomBytes(7).toString('hex')}`
  } else {
    if (!paymentsLive() || !verifySignature(orderId, paymentId, signature)) {
      return res.status(400).json({ error: 'Payment verification failed. If money was debited, contact support with your payment ID.' })
    }
    pid = paymentId
  }

  const done = await db.update(row.id, { status: 'COMPLETED', paymentId: pid, paidAt: new Date().toISOString(), paymentMode: mock ? 'mock' : 'razorpay' })
  sendRegistrationEmail(done).then(
    () => db.update(done.id, { emailedAt: new Date().toISOString() }),
    e => console.error('[mail] failed', e),
  )
  res.json({ registration: publicView(done) })
})

export default r
