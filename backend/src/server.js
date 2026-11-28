import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import compression from 'compression'
import { config, paymentsLive } from './config.js'
import { initDb } from './db.js'
import registrations from './routes/registrations.js'
import payments from './routes/payments.js'

await initDb()
fs.mkdirSync(config.uploadsDir, { recursive: true })

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(compression())

// ---- API (never cached) ----
app.use('/api', express.json({ limit: '5mb' }), (req, res, next) => { res.set('Cache-Control', 'no-store'); next() })
app.use('/api', registrations)
app.use('/api', payments)
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.error('[api]', err)
    return res.status(err.status || 500).json({ error: err.type === 'entity.too.large' ? 'Photo is too large.' : 'Something went wrong.' })
  }
  next(err)
})

// ---- Uploaded photos: 30 days ----
app.use('/uploads', express.static(config.uploadsDir, { maxAge: '30d', index: false }), (req, res) => res.status(404).end())

// ---- Built website (Frontend dist) ----
if (fs.existsSync(config.distDir)) {
  app.use(express.static(config.distDir, {
    setHeaders(res, file) {
      if (file.includes(`${path.sep}assets${path.sep}`)) res.set('Cache-Control', 'public, max-age=31536000, immutable')
      else if (file.endsWith('.html')) res.set('Cache-Control', 'no-cache')
      else res.set('Cache-Control', 'public, max-age=86400')
    },
  }))
  // Real 404 status for unknown pages (no SPA fallback)
  app.use((req, res) => {
    res.status(404).set('Cache-Control', 'no-cache').sendFile(path.join(config.distDir, '404.html'))
  })
}

app.listen(config.port, () => {
  console.log(`[server] http://localhost:${config.port}`)
  console.log(`[server] payments: ${paymentsLive() ? 'Razorpay LIVE keys' : 'MOCK mode (no Razorpay keys)'} · fee ₹${config.fee} · deadline ${config.deadline.toISOString()}`)
})
