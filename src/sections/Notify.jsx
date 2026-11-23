import { useRef, useState } from 'react'
import { CATEGORIES, EVENT } from '../content'
import { useInView } from '../hooks'

const OPTIONS = ['Kids (5–12, solo)', 'Teens (13–19, solo)', 'Adults (20+, solo)', 'Group (2–10 members)']
const PERKS = [
  ['Audition date for your city', 'Sent to your mobile the moment it’s announced'],
  ['First to register', 'Hear before registrations open publicly'],
  [`${CATEGORIES.length} categories, every style`, 'Kids, Teens, Adults or a Group crew'],
]

export default function Notify() {
  const [ref, inView] = useInView(0.2)
  const ticket = useRef(null)
  const [form, setForm] = useState({ name: '', phone: '', city: '', category: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const move = e => {
    if (!matchMedia('(pointer: fine)').matches) return
    const el = ticket.current, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg')
    el.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg')
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%')
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%')
  }
  const leave = () => { ticket.current.style.setProperty('--rx', '0deg'); ticket.current.style.setProperty('--ry', '0deg') }

  const onSubmit = e => {
    e.preventDefault()
    const phone = form.phone.replace(/\D/g, '')
    if (!form.name.trim()) return setError('Enter your full name.')
    if (phone.length !== 10) return setError('Enter a 10-digit mobile number.')
    if (!form.city.trim()) return setError('Enter the city you’d like to audition in.')
    if (!form.category) return setError('Choose a category.')
    setError('')
    // TODO: POST to your API / Google Sheet here
    setDone(form.name.trim().split(' ')[0])
  }

  return (
    <section id="notify" className={'nt' + (inView ? ' in' : '')} ref={ref}>
      <div className="wrap nt-grid">
        <div className="nt-copy">
          <p className="nt-kicker"><span />Registrations · {EVENT.year}</p>
          <h2 className="display nt-title" aria-label="Registrations open soon">
            <span className="nt-line"><span>Registrations</span></span>
            <span className="nt-line"><span className="metal">open soon</span></span>
          </h2>
          <p className="nt-desc">
            Leave your details and we’ll let you know as soon as registration opens, along with the audition date
            for your city.
          </p>
          <ul className="nt-perks">
            {PERKS.map(([t, s], i) => (
              <li key={t} style={{ '--i': i }}>
                <span className="nt-check" aria-hidden="true">
                  <svg viewBox="0 0 20 20"><path d="m5 10.5 3.2 3.2L15 7" /></svg>
                </span>
                <span><b>{t}</b><small>{s}</small></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="nt-stage">
          <div className={'nt-ticket' + (done ? ' flipped' : '')} ref={ticket} onPointerMove={move} onPointerLeave={leave}>
            {/* front: the form */}
            <div className="nt-face nt-front">
              <span className="nt-glare" aria-hidden="true" />
              <div className="nt-body">
                <div className="nt-head">
                  <span className="nt-badge">Your golden ticket</span>
                  <p>Be the first to hear when auditions open in your city.</p>
                </div>
                <form onSubmit={onSubmit} noValidate className="nt-form">
                  <label>Full name
                    <input name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={set('name')} required />
                  </label>
                  <label>Mobile number
                    <input name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit number"
                           value={form.phone} onChange={set('phone')} required />
                  </label>
                  <label>City
                    <input name="city" autoComplete="address-level2" placeholder="Where you’ll audition" value={form.city} onChange={set('city')} required />
                  </label>
                  <label>Category
                    <select name="category" value={form.category} onChange={set('category')} required>
                      <option value="">Choose one</option>
                      {OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </label>
                  <button className="btn nt-submit" type="submit">Notify me <span aria-hidden="true">→</span></button>
                  <p className={'form-msg' + (error ? ' err' : '')} role="status" aria-live="polite">{error}</p>
                </form>
              </div>
              <div className="nt-stub" aria-hidden="true">
                <span>Auditions {EVENT.year}</span>
                <i className="nt-barcode" />
              </div>
            </div>

            {/* back: confirmation */}
            <div className="nt-face nt-back" role="status" aria-hidden={!done}>
              <span className="nt-seal" aria-hidden="true">
                <svg viewBox="0 0 20 20"><path d="m5 10.5 3.2 3.2L15 7" /></svg>
              </span>
              <h3>You’re on the list{done ? `, ${done}` : ''}</h3>
              <p>We’ll message you on your mobile number as soon as registration for {EVENT.name} {EVENT.year} opens.</p>
              <span className="nt-badge">Admit one · Auditions {EVENT.year}</span>
            </div>
          </div>
          <div className="nt-shadow" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
