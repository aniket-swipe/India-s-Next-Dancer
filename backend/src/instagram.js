// Best-effort check whether an Instagram profile is public. Instagram does not
// offer an official API for this, so the answer can be "unknown" — in that case
// we let the registration through and the team checks manually.
const cache = new Map() // username -> { status, at }
const TTL = 6 * 60 * 60 * 1000

export function instagramUser(link) {
  try {
    const u = new URL(link)
    if (!/(^|\.)instagram\.com$/i.test(u.hostname)) return null
    const first = u.pathname.split('/').filter(Boolean)[0] || ''
    if (!first || ['p', 'reel', 'reels', 'tv', 'stories', 'explore'].includes(first.toLowerCase())) return null
    return /^[A-Za-z0-9._]{1,30}$/.test(first) ? first.toLowerCase() : null
  } catch { return null }
}

/** @returns {Promise<'public'|'private'|'not_found'|'unknown'>} */
export async function checkInstagram(username) {
  const hit = cache.get(username)
  if (hit && Date.now() - hit.at < TTL) return hit.status
  let status = 'unknown'
  try {
    const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; registration-check)', 'Accept-Language': 'en' },
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
    })
    if (res.status === 404) status = 'not_found'
    else if (res.ok) {
      const html = await res.text()
      if (/"is_private"\s*:\s*true/.test(html) || /This account is private/i.test(html)) status = 'private'
      else if (/"is_private"\s*:\s*false/.test(html)) status = 'public'
    }
  } catch { /* network/timeout — stay unknown */ }
  cache.set(username, { status, at: Date.now() })
  if (cache.size > 5000) cache.delete(cache.keys().next().value)
  return status
}
