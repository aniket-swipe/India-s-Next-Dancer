import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(here, '..')

try { process.loadEnvFile(path.join(ROOT, '.env')) } catch { /* no .env file — use process env */ }

const env = process.env
export const config = {
  port: Number(env.PORT) || 4000,
  prod: env.NODE_ENV === 'production',
  siteUrl: (env.SITE_URL || 'http://localhost:5173').replace(/\/$/, ''),
  fee: Number(env.REGISTRATION_FEE) || 590, // ₹ inclusive of GST
  deadline: new Date(env.REGISTRATION_DEADLINE || '2027-03-31T23:59:59+05:30'),
  razorpay: { keyId: env.RAZORPAY_KEY_ID || '', keySecret: env.RAZORPAY_KEY_SECRET || '' },
  smtp: {
    host: env.SMTP_HOST || '',
    port: Number(env.SMTP_PORT) || 587,
    secure: env.SMTP_SECURE === 'true',
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
  },
  mailFrom: env.MAIL_FROM || "India's Next Dancer <support@kgilproduction.com>",
  adminToken: env.ADMIN_TOKEN || '',
  dataDir: path.join(ROOT, 'data'),
  uploadsDir: path.join(ROOT, 'uploads'),
  distDir: path.resolve(ROOT, '..', 'frontend', 'dist'),
}
export const paymentsLive = () => Boolean(config.razorpay.keyId && config.razorpay.keySecret)
export const isClosed = () => Date.now() > config.deadline.getTime()
