async function call(path, { method = 'GET', body, headers } = {}) {
  let res
  try {
    res = await fetch(`/api${path}`, {
      method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw Object.assign(new Error('Can’t reach the server. Check your internet connection and try again.'), { offline: true })
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status, errors: data.errors, data })
  return data
}

export const api = {
  config: () => call('/config'),
  register: body => call('/registrations', { method: 'POST', body }),
  get: id => call(`/registrations/${encodeURIComponent(id)}`),
  list: token => call('/registrations', { headers: { 'x-admin-token': token } }),
  order: registrationId => call('/payments/order', { method: 'POST', body: { registrationId } }),
  verify: body => call('/payments/verify', { method: 'POST', body }),
  instagram: link => call('/instagram/check', { method: 'POST', body: { link } }),
}

let rzp
export function loadRazorpay() {
  rzp ||= new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(window.Razorpay)
    s.onerror = () => { rzp = null; reject(new Error('Couldn’t load Razorpay. Check your connection and try again.')) }
    document.head.appendChild(s)
  })
  return rzp
}
