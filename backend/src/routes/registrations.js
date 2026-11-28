import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { Router } from 'express'
import { config, isClosed } from '../config.js'
import { db, newId } from '../db.js'
import { parsePhoto, validateRegistration } from '../validate.js'
import { checkInstagram, instagramUser } from '../instagram.js'

const r = Router()

// very small per-IP limiter for writes
const hits = new Map()
function limited(ip, max = 20, windowMs = 60 * 60 * 1000) {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter(t => now - t < windowMs)
  list.push(now)
  hits.set(ip, list)
  return list.length > max
}

/** What the public (the registrant) may see about a registration. */
export function publicView(x) {
  return {
    id: x.id, event: x.event || 'IND', status: x.status, name: x.name, category: x.category,
    style: x.style === 'Other' ? x.styleOther : x.style, city: x.city,
    crewSize: x.crewSize || 0,
    amount: x.amount, paymentId: x.paymentId || null, paidAt: x.paidAt || null,
    email: x.email.replace(/^(.{2}).*(@.*)$/, '$1•••$2'),
  }
}

r.get('/config', (req, res) => {
  res.json({ fee: config.fee, deadline: config.deadline.toISOString(), closed: isClosed() })
})

r.post('/registrations', async (req, res) => {
  if (isClosed()) return res.status(410).json({ error: 'Registrations are closed.' })
  if (limited(req.ip)) return res.status(429).json({ error: 'Too many attempts. Please try again later.' })

  const { data, errors } = validateRegistration(req.body)
  const photo = parsePhoto(req.body?.photo)
  if (!photo) errors.photo = 'Take a profile photo with your camera.'
  if (Object.keys(errors).length) return res.status(422).json({ error: 'Please correct the highlighted fields.', errors })


  // Re-submitting an unpaid registration updates it instead of creating a duplicate.
  const existing = typeof req.body.id === 'string' ? db.get(req.body.id) : null
  const reuse = existing && existing.status === 'PENDING_PAYMENT' && existing.mobile === data.mobile && (existing.event || 'IND') === data.event ? existing : null
  const id = reuse ? reuse.id : newId()

  await fs.mkdir(config.uploadsDir, { recursive: true })
  const file = `${id}-${crypto.randomBytes(6).toString('hex')}.${photo.ext}`
  await fs.writeFile(path.join(config.uploadsDir, file), photo.buf)
  if (reuse?.photo) fs.unlink(path.join(config.uploadsDir, path.basename(reuse.photo))).catch(() => {})

  const now = new Date().toISOString()
  const fields = { ...data, photo: `/uploads/${file}`, amount: config.fee, consentAt: now, ip: req.ip }
  const row = reuse
    ? await db.update(id, fields)
    : await db.insert({ id, ...fields, status: 'PENDING_PAYMENT', createdAt: now, updatedAt: now })

  res.status(reuse ? 200 : 201).json({ registration: publicView(row) })
})

r.get('/registrations/:id', (req, res) => {
  const row = db.get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Registration not found.' })
  res.json({ registration: publicView(row) })
})

// Admin list — requires ADMIN_TOKEN (header: x-admin-token)
r.get('/registrations', (req, res) => {
  if (!config.adminToken) return res.status(403).json({ error: 'Admin view is disabled. Set ADMIN_TOKEN in backend/.env.' })
  const token = req.get('x-admin-token') || ''
  const ok = token.length === config.adminToken.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(config.adminToken))
  if (!ok) return res.status(401).json({ error: 'Invalid admin token.' })
  res.json({ registrations: db.all().map(({ ip, ...x }) => x) })
})

r.post('/instagram/check', async (req, res) => {
  const user = instagramUser(req.body?.link || '')
  if (!user) return res.json({ instagram: false })
  res.json({ instagram: true, username: user, status: await checkInstagram(user) })
})

export default r
