import nodemailer from 'nodemailer'
import { config } from './config.js'

let transport = null
if (config.smtp.host) {
  transport = nodemailer.createTransport({
    host: config.smtp.host, port: config.smtp.port, secure: config.smtp.secure,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
  })
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export async function sendRegistrationEmail(r) {
  const battle = r.event === 'BATTLE'
  const show = battle ? "India's Next Battle 2027" : "India's Next Dancer 2027"
  const link = `${config.siteUrl}${battle ? '/battle-register/' : '/register/'}?id=${r.id}`
  const dance = r.style === 'Other' ? r.styleOther : r.style
  const rows = [['Registration ID', r.id], ['Name', r.name], ...(r.category ? [['Category', r.category]] : []), ['Dance style', dance], ...(r.crewSize ? [['Crew members', r.crewSize]] : []), ['Audition city', r.city], ['Payment ID', r.paymentId], ['Amount paid', `₹${r.amount} (incl. GST)`]]
  const subject = `Registration Successful – ${show} (${r.id})`
  const text = `Hi ${r.name},\n\nYour registration for ${show} is confirmed.\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nView your registration: ${link}\n\nWe'll share your audition date, venue and reporting time before the auditions in ${r.city}.\n\n— KGIL Productions\nsupport@kgilproduction.com · +91 98366 76837`
  const html = `<div style="font-family:Arial,sans-serif;background:#0b0a08;color:#f4ead7;padding:28px">
  <h1 style="margin:0 0 6px;color:#e8b04a;font-size:24px">Registration Successful!</h1>
  <p style="margin:0 0 18px">Hi ${esc(r.name)}, your registration for <b>${show}</b> is confirmed.</p>
  <table style="border-collapse:collapse;width:100%;max-width:520px">${rows.map(([k, v]) => `<tr><td style="padding:8px 10px;border:1px solid #333;color:#b8a585">${esc(k)}</td><td style="padding:8px 10px;border:1px solid #333"><b>${esc(v)}</b></td></tr>`).join('')}</table>
  <p style="margin:18px 0"><a href="${esc(link)}" style="background:#e8b04a;color:#1e1002;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:bold">View registration</a></p>
  <p style="color:#b8a585;font-size:13px">We'll share your audition date, venue and reporting time before the auditions in ${esc(r.city)}.<br>KGIL Productions · support@kgilproduction.com · +91 98366 76837</p></div>`

  if (!transport) {
    console.log(`[mail] SMTP not configured — would send to ${r.email}:\n${subject}\n${text}\n`)
    return { logged: true }
  }
  await transport.sendMail({ from: config.mailFrom, to: r.email, subject, text, html })
  return { sent: true }
}
