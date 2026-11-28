// Defaults shown before /api/config answers (and during prerender). Keep in sync with backend/.env.
export const FEE = 590 // inclusive of GST
export const DEADLINE = '2027-03-31T23:59:59+05:30'

export const CITIES = ['Pune', 'Mumbai', 'Delhi', 'Lucknow', 'Ahmedabad', 'Chennai', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Jaipur']
export const CATS = [
  { v: 'Kids', label: 'Kids', sub: 'Up to 12 yrs · Solo', fits: a => a >= 5 && a <= 12 },
  { v: 'Teen', label: 'Teen', sub: '13–19 yrs · Solo', fits: a => a >= 13 && a <= 19 },
  { v: 'Adults', label: 'Adults', sub: '20+ yrs · Solo', fits: a => a >= 20 },
  { v: 'Group', label: 'Group', sub: '2–10 members · Crew', fits: () => true },
]
export const STYLES = ['Folk', 'Freestyle', 'Hip Hop', 'Popping', 'Krump', 'Other']

export function ageOf(dob) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return null
  const d = new Date(dob + 'T00:00:00'), now = new Date()
  if (isNaN(d) || d > now) return null
  let a = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--
  return a
}
export const suggestCat = age => (age == null ? null : age <= 12 ? 'Kids' : age <= 19 ? 'Teen' : 'Adults')

export function validate(f, { battle = false } = {}) {
  const e = {}
  const age = ageOf(f.dob)
  if (!f.photo) e.photo = 'Take a profile photo with your camera.'
  if (!/^[\p{L} .'-]{2,60}$/u.test(f.name.trim())) e.name = f.name.trim() ? 'Use letters only (at least 2).' : 'Enter your full name.'
  if (!f.dob) e.dob = 'Enter your date of birth.'
  else if (age == null) e.dob = 'Enter a valid date of birth.'
  else if (age < 5) e.dob = 'Participants must be at least 5 years old.'
  if (!f.city) e.city = 'Choose your audition city.'
  if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = f.mobile ? 'Enter a valid 10-digit number starting with 6–9.' : 'Enter your mobile number.'
  if (f.altMobile) {
    if (!/^[6-9]\d{9}$/.test(f.altMobile)) e.altMobile = 'Enter a valid 10-digit number.'
    else if (f.altMobile === f.mobile) e.altMobile = 'Must be different from your mobile number.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = f.email ? 'Enter a valid email address.' : 'Enter your email address.'
  const cat = CATS.find(c => c.v === f.category)
  if (battle) { /* no category for Battle */ }
  else if (!cat) e.category = 'Choose a category.'
  else if (age != null && !cat.fits(age)) e.category = `${cat.label} doesn’t match the age (${age} years).`
  if (battle) {
    const n = Number(f.crewSize)
    if (!/^\d+$/.test(String(f.crewSize ?? '')) || n < 1 || n > 10) e.crewSize = 'Enter a whole number from 1 to 10.'
  }
  if (!f.style) e.style = 'Choose your dance style.'
  if (f.style === 'Other' && f.styleOther.trim().length < 2) e.styleOther = 'Tell us your dance style.'
  if (battle) { /* no video link for Battle */ }
  else if (!f.link.trim()) e.link = 'Add your dance video link.'
  else if (!normalizeLink(f.link)) e.link = 'Enter a valid link, e.g. youtube.com/… or drive.google.com/…'
  if (!f.consent) e.consent = 'Please accept to continue.'
  return e
}
/** Accepts any web link (Instagram, YouTube, Google Drive, Facebook, etc.), with or without https:// */
export function normalizeLink(v) {
  const t = (v || '').trim()
  if (!t) return ''
  const withProto = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`
  try {
    const u = new URL(withProto)
    if (!/^https?:$/.test(u.protocol) || !/\.[a-z]{2,}$/i.test(u.hostname)) return null
    return u.href
  } catch { return null }
}

export const REQUIRED = ['photo', 'name', 'dob', 'city', 'mobile', 'email', 'category', 'style', 'link', 'consent']
