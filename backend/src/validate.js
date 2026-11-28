export const CITIES = ['Pune', 'Mumbai', 'Delhi', 'Lucknow', 'Ahmedabad', 'Chennai', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Jaipur']
export const CATEGORIES = ['Kids', 'Teen', 'Adults', 'Group']
export const STYLES = ['Folk', 'Freestyle', 'Hip Hop', 'Popping', 'Krump', 'Other']

export function ageOn(dob, now = new Date()) {
  const d = new Date(dob + 'T00:00:00')
  if (isNaN(d)) return null
  let a = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--
  return a
}

export function categoryFits(category, age) {
  if (category === 'Group') return true
  if (category === 'Kids') return age >= 5 && age <= 12
  if (category === 'Teen') return age >= 13 && age <= 19
  if (category === 'Adults') return age >= 20
  return false
}

const str = v => (typeof v === 'string' ? v.trim() : '')

/** Returns { data, errors } — errors is an object keyed by field name. */
export function validateRegistration(body = {}) {
  const e = {}
  const data = {
    name: str(body.name).replace(/\s+/g, ' '),
    dob: str(body.dob),
    city: str(body.city),
    mobile: str(body.mobile).replace(/\D/g, ''),
    altMobile: str(body.altMobile).replace(/\D/g, ''),
    email: str(body.email).toLowerCase(),
    category: str(body.category),
    style: str(body.style),
    styleOther: str(body.styleOther),
    link: str(body.link),
    consent: body.consent === true,
    event: body.event === 'BATTLE' ? 'BATTLE' : 'IND',
  }

  if (!/^[\p{L} .'-]{2,60}$/u.test(data.name)) e.name = 'Enter your full name (letters only).'
  const age = ageOn(data.dob)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dob) || age == null) e.dob = 'Enter a valid date of birth.'
  else if (age < 5) e.dob = 'Participants must be at least 5 years old.'
  else if (age > 100) e.dob = 'Enter a valid date of birth.'
  if (!CITIES.includes(data.city)) e.city = 'Choose an audition city.'
  if (!/^[6-9]\d{9}$/.test(data.mobile)) e.mobile = 'Enter a valid 10-digit mobile number.'
  if (data.altMobile) {
    if (!/^[6-9]\d{9}$/.test(data.altMobile)) e.altMobile = 'Enter a valid 10-digit number.'
    else if (data.altMobile === data.mobile) e.altMobile = 'Alternate number must be different from your mobile.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) || data.email.length > 120) e.email = 'Enter a valid email address.'
  if (data.event === 'BATTLE') {
    data.category = '' // Battle has no category
    const n = Number(body.crewSize)
    data.crewSize = Number.isInteger(n) ? n : 0
    if (data.crewSize < 1 || data.crewSize > 10) e.crewSize = 'Crew members must be a whole number from 1 to 10.'
  }
  else if (!CATEGORIES.includes(data.category)) e.category = 'Choose a category.'
  else if (age != null && !categoryFits(data.category, age)) e.category = `The ${data.category} category doesn’t match the age (${age}).`
  if (!STYLES.includes(data.style)) e.style = 'Choose a dance style.'
  if (data.style === 'Other' && !/^.{2,40}$/.test(data.styleOther)) e.styleOther = 'Tell us your dance style.'
  if (data.style !== 'Other') data.styleOther = ''
  // Any web link is accepted (Instagram, YouTube, Google Drive, …); https:// is added if missing. Battle has no link.
  if (data.event === 'BATTLE') data.link = ''
  else try {
    const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(data.link) ? data.link : `https://${data.link}`
    const u = new URL(raw)
    if (!/^https?:$/.test(u.protocol) || !/\.[a-z]{2,}$/i.test(u.hostname) || raw.length > 300) throw 0
    data.link = u.href
  } catch { e.link = data.link ? 'Enter a valid link.' : 'Add your dance video link.' }
  if (!data.consent) e.consent = 'Please accept the terms to continue.'

  return { data: { ...data, age }, errors: e }
}

/** Accepts a data:image/jpeg|png;base64 URL up to ~3 MB. */
export function parsePhoto(dataUrl) {
  const m = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '')
  if (!m) return null
  const buf = Buffer.from(m[2], 'base64')
  if (buf.length < 2000 || buf.length > 3 * 1024 * 1024) return null
  return { ext: m[1] === 'png' ? 'png' : 'jpg', buf }
}
