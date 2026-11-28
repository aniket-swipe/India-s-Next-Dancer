import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '../router'
import Camera from './Camera'
import PolicyModal from './PolicyModal'
import { api, loadRazorpay } from './api'
import { CATS, CITIES, REQUIRED, STYLES, ageOf, normalizeLink, suggestCat, validate } from './config'

const TTL = 24 * 60 * 60 * 1000
const EMPTY = { photo: '', name: '', dob: '', city: '', mobile: '', altMobile: '', email: '', category: '', style: '', styleOther: '', link: '', consent: false, crewSize: '1' }
const STEPS = ['Your details', 'Payment', 'Confirmed']

const makeStore = KEY => ({
  read() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null')
      if (!s || Date.now() - s.at > TTL) { localStorage.removeItem(KEY); return null }
      return s
    } catch { return null }
  },
  write(v) { try { localStorage.setItem(KEY, JSON.stringify({ ...v, at: Date.now() })) } catch { /* quota / private mode */ } },
  clear() { try { localStorage.removeItem(KEY) } catch { /* ignore */ } },
})

const I = {
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0" />,
  cal: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  pin: <><path d="M12 21s-7-6.6-7-12a7 7 0 0 1 14 0c0 5.4-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  crew: <><circle cx="9" cy="8" r="3.2" /><circle cx="17" cy="9" r="2.6" /><path d="M3 20a6 6 0 0 1 12 0M14.5 14.5A5 5 0 0 1 21 19" /></>,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
}
const Svg = ({ d }) => <svg viewBox="0 0 24 24" aria-hidden="true">{d}</svg>
const Tick = () => <svg className="rg-ok" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" /><path d="m6 10.3 2.6 2.6L14 7.5" /></svg>

function Field({ k, label, optional, icon, err, ok, hint, children }) {
  return (
    <div className={'rg-field' + (err ? ' bad' : ok ? ' good' : '')} data-field={k}>
      <label htmlFor={`rg-${k}`}>{label}{optional ? <span className="rg-opt"> (optional)</span> : <em aria-hidden="true"> *</em>}</label>
      <div className="rg-box">
        {icon && <span className="rg-ico"><Svg d={icon} /></span>}
        {children}
        {ok && <Tick />}
      </div>
      {err ? <p className="rg-err" id={`rg-${k}-err`}>{err}</p> : hint ? <p className="rg-hint">{hint}</p> : null}
    </div>
  )
}

function Section({ n, title, children }) {
  return (
    <section className="rg-sec">
      <h3 className="rg-sec-h"><span>{n}</span>{title}</h3>
      {children}
    </section>
  )
}

export default function RegisterForm({ fee, deadline, closed, battle = false }) {
  const KEY = battle ? 'ind-battle-reg-v1' : 'ind-reg-v1'
  const SHOW = battle ? 'India’s Next Battle 2027' : 'India’s Next Dancer 2027'
  const BASE = battle ? '/battle-register/' : '/register/'
  const store = makeStore(KEY)
  const [f, setF] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [serverErr, setServerErr] = useState({})
  const [step, setStep] = useState(0)
  const [reg, setReg] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [mock, setMock] = useState(null)
  const [restored, setRestored] = useState(false)
  const top = useRef(null)
  const [policy, setPolicy] = useState(null)
  const closePolicy = useCallback(() => setPolicy(null), [])
  const openPolicy = k => e => { e.preventDefault(); e.stopPropagation(); setPolicy(k) }

  // ---- restore saved progress, then confirm it with the backend ----
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const lookup = params.get('id')
    const saved = store.read()
    if (saved?.data) { setF({ ...EMPTY, ...saved.data }); setRestored(true) }
    const id = lookup || saved?.id
    if (!id) return
    api.get(id).then(({ registration }) => {
      setReg(registration)
      if (registration.status === 'COMPLETED') setStep(2)
      else if (saved?.id === id) setStep(1)
    }).catch(err => {
      if (err.status === 404 && saved?.id) store.write({ data: saved.data, id: null, step: 0 })
      if (lookup) setNotice(err.status === 404 ? `We couldn’t find registration ${lookup}.` : err.message)
    })
  }, [])

  useEffect(() => { if (step < 2) store.write({ data: f, id: reg?.status === 'PENDING_PAYMENT' ? reg.id : null, step }) }, [f, reg, step])

  const age = ageOf(f.dob)
  const suggested = suggestCat(age)
  const crewN = Number(f.crewSize) || 0
  const REQ = battle ? [...REQUIRED.filter(k => k !== 'category' && k !== 'link'), 'crewSize'] : REQUIRED
  const errors = useMemo(() => ({ ...validate(f, { battle }), ...serverErr }), [f, serverErr, battle])
  const show = k => (touched[k] ? errors[k] : '')
  const ok = k => touched[k] && !errors[k] && (k === 'altMobile' ? !!f.altMobile : true)
  const done = REQ.filter(k => !errors[k] && !(k === 'style' && errors.styleOther)).length
  const pct = Math.round((done / REQ.length) * 100)

  const set = (k, v) => {
    setF(p => ({ ...p, [k]: v }))
    if (serverErr[k]) setServerErr(({ [k]: _, ...rest }) => rest)
  }
  const onText = k => e => {
    let v = e.target.value
    if (k === 'crewSize') v = v.replace(/\D/g, '').slice(0, 2)
    if (k === 'mobile' || k === 'altMobile') v = v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '').slice(0, 10)
    set(k, v)
  }
  const touch = k => () => setTouched(t => (t[k] ? t : { ...t, [k]: true }))
  const a11y = k => ({ id: `rg-${k}`, name: k, onBlur: touch(k), ...(show(k) ? { 'aria-invalid': true, 'aria-describedby': `rg-${k}-err` } : {}) })


  const goTop = () => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // ---- step 1 submit ----
  const submitDetails = async e => {
    e?.preventDefault()
    setTouched(Object.fromEntries([...REQ, 'styleOther', 'altMobile'].map(k => [k, true])))
    const order = ['photo', 'name', 'dob', 'city', 'mobile', 'altMobile', 'email', 'category', 'crewSize', 'style', 'styleOther', 'link', 'consent']
    const firstErr = order.find(k => errors[k])
    if (firstErr) {
      const el = document.querySelector(`[data-field="${firstErr}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => el?.querySelector('input,select,button')?.focus({ preventScroll: true }), 400)
      return
    }
    setBusy(true); setNotice('')
    try {
      const body = { ...f, name: f.name.trim(), email: f.email.trim(), link: battle ? '' : normalizeLink(f.link), category: battle ? '' : f.category, ...(battle ? { crewSize: crewN } : {}), styleOther: f.styleOther.trim(), id: reg?.status === 'PENDING_PAYMENT' ? reg.id : undefined, event: battle ? 'BATTLE' : 'IND' }
      const { registration } = await api.register(body)
      setReg(registration); setStep(1); goTop()
    } catch (err) {
      if (err.errors) { setServerErr(err.errors); setTimeout(() => document.querySelector('.rg-field.bad, .rg-cam.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50) }
      setNotice(err.message)
    } finally { setBusy(false) }
  }

  // ---- step 2: payment ----
  const finish = registration => { setReg(registration); setStep(2); setMock(null); store.clear(); goTop() }
  const pay = async () => {
    setBusy(true); setNotice('')
    try {
      const order = await api.order(reg.id)
      if (order.mock) { setMock(order); setBusy(false); return }
      const Razorpay = await loadRazorpay()
      const rz = new Razorpay({
        key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
        name: SHOW, description: `Registration fee · ${reg.id}`,
        prefill: order.prefill, notes: { registrationId: reg.id }, theme: { color: '#e8b04a' },
        handler: async resp => {
          setBusy(true)
          try { finish((await api.verify({ registrationId: reg.id, ...resp })).registration) }
          catch (err) { setNotice(err.message) } finally { setBusy(false) }
        },
        modal: { ondismiss: () => { setBusy(false); setNotice('Payment was cancelled. You can try again.') } },
      })
      rz.on('payment.failed', r => setNotice(r?.error?.description || 'Payment failed. Please try again.'))
      rz.open()
    } catch (err) {
      if (err.status === 409 && err.data?.registration) return finish(err.data.registration)
      setNotice(err.message); setBusy(false)
    }
  }
  const payMock = async () => {
    setBusy(true); setNotice('')
    try { finish((await api.verify({ registrationId: reg.id, razorpay_order_id: mock.orderId, mock: true })).registration) }
    catch (err) { setNotice(err.message) } finally { setBusy(false) }
  }

  const restart = () => {
    store.clear(); setF(EMPTY); setTouched({}); setServerErr({}); setReg(null); setStep(0); setMock(null); setNotice(''); setRestored(false)
    if (location.search) history.replaceState(null, '', location.pathname)
    goTop()
  }

  const closing = new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })

  if (closed && step < 2) {
    return (
      <div className="rg-closed" ref={top}>
        <span className="rg-closed-ico" aria-hidden="true">✕</span>
        <h3>Registrations Closed</h3>
        <p>Registrations for {SHOW} closed on {closing}. Follow us for audition updates.</p>
        <Link className="rg-btn" to="/">Back to home</Link>
      </div>
    )
  }

  const stepper = (
    <ol className="rg-steps">
      {STEPS.map((s, i) => (
        <li key={s} className={i < step ? 'done' : i === step ? 'on' : ''} aria-current={i === step ? 'step' : undefined}>
          <span>{i < step ? '✓' : i + 1}</span><b>{s}</b>
        </li>
      ))}
    </ol>
  )

  return (
    <div className="rg-shell" ref={top}>
      {/* ---------- side panel (desktop) ---------- */}
      <aside className="rg-side">
        <div className="rg-side-in">
          <picture className="rg-logo"><source srcSet="/images/indias-next-dancer-icon-192.webp" type="image/webp" /><img src="/images/indias-next-dancer-icon-192.png" alt="" width="64" height="64" /></picture>
          <p className="rg-side-k">Official registration</p>
          <h3 className="rg-side-h">{battle ? 'India’s Next Battle' : 'India’s Next Dancer'} <span>2027</span></h3>
          {stepper}
          <div className="rg-fee">
            <span>Registration fee</span>
            <b>₹{fee}</b>
            <small className="rg-gst">Inclusive of GST</small>
            <small>Closes {closing}</small>
          </div>
          <div className="rg-ready">
            <p>Keep these ready</p>
            <ul>
              <li>Camera for a live profile photo</li>
              <li>Date of birth (age proof at audition)</li>
              {!battle && <li>Public Dance video Link</li>}
              <li>UPI, card or net banking for ₹{fee}</li>
            </ul>
          </div>
          <p className="rg-secure"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>Payments secured by Razorpay</p>
        </div>
      </aside>

      {/* ---------- main card ---------- */}
      <div className="rg-main">
        <div className="rg-mstep">{stepper}</div>

        {notice && <p className="rg-notice" role="alert">{notice}</p>}

        {step === 0 && (
          <form className="rg-form" onSubmit={submitDetails} noValidate>
            <div className="rg-form-head">
              <div>
                <h2>{battle ? 'Team Leader Details' : 'Your details'}</h2>
                <p>Fields marked <em>*</em> are required.</p>
              </div>
              <div className="rg-meter" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Form completion">
                <span>{pct}%</span><i style={{ '--p': pct + '%' }} />
              </div>
            </div>
            {restored && <p className="rg-restored">We restored your saved progress. <button type="button" onClick={restart}>Start a new registration</button></p>}

            <Section n="01" title="Profile photo">
              <div data-field="photo">
                <Camera value={f.photo} onChange={v => { set('photo', v); setTouched(t => ({ ...t, photo: true })) }} error={show('photo')} />
                {show('photo') && <p className="rg-err">{show('photo')}</p>}
              </div>
            </Section>

            <Section n="02" title="Personal">
              <div className="rg-grid">
                <Field k="name" label="Full name" icon={I.user} err={show('name')} ok={ok('name')}>
                  <input {...a11y('name')} autoComplete="name" placeholder="As on your ID" maxLength={60} value={f.name} onChange={onText('name')} />
                </Field>
                <Field k="dob" label="Date of birth" icon={I.cal} err={show('dob')} ok={ok('dob')} hint={age != null && age >= 0 ? `Age: ${age} year${age === 1 ? '' : 's'}` : battle ? 'Used to confirm your age' : 'Used to check your category'}>
                  <input {...a11y('dob')} type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} min="1920-01-01" value={f.dob}
                         onChange={e => { set('dob', e.target.value); touch('dob')() }} />
                </Field>
                <Field k="city" label="Audition city" icon={I.pin} err={show('city')} ok={ok('city')}>
                  <select {...a11y('city')} value={f.city} onChange={e => { set('city', e.target.value); touch('city')() }}>
                    <option value="">Choose a city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            <Section n="03" title="Contact">
              <div className="rg-grid">
                <Field k="mobile" label="Mobile number" icon={I.phone} err={show('mobile')} ok={ok('mobile')}>
                  <span className="rg-pre">+91</span>
                  <input {...a11y('mobile')} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" value={f.mobile} onChange={onText('mobile')} />
                </Field>
                <Field k="altMobile" label="Alternate number" optional icon={I.phone} err={show('altMobile')} ok={ok('altMobile')}>
                  <span className="rg-pre">+91</span>
                  <input {...a11y('altMobile')} type="tel" inputMode="numeric" placeholder="Parent / guardian" value={f.altMobile} onChange={onText('altMobile')} />
                </Field>
                <Field k="email" label="Email" icon={I.mail} err={show('email')} ok={ok('email')} hint="Your confirmation is sent here">
                  <input {...a11y('email')} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" maxLength={120} value={f.email} onChange={onText('email')} />
                </Field>
              </div>
            </Section>

            <Section n="04" title="Audition">
              {!battle && <fieldset className={'rg-field rg-set' + (show('category') ? ' bad' : '')} data-field="category">
                <legend>Category <em aria-hidden="true">*</em></legend>
                <div className="rg-cards">
                  {CATS.map(c => (
                    <label key={c.v} className={'rg-card' + (f.category === c.v ? ' on' : '')}>
                      <input type="radio" name="category" value={c.v} checked={f.category === c.v} onChange={() => { set('category', c.v); touch('category')() }} />
                      {suggested === c.v && <span className="rg-for">For you</span>}
                      <b>{c.label}</b><small>{c.sub}</small>
                    </label>
                  ))}
                </div>
                {show('category') && <p className="rg-err">{show('category')}</p>}
              </fieldset>}

              {battle && (
                <div className="rg-crew">
                  <div className={'rg-field' + (show('crewSize') ? ' bad' : ok('crewSize') ? ' good' : '')} data-field="crewSize">
                    <label htmlFor="rg-crewSize">Crew members <em aria-hidden="true">*</em></label>
                    <div className="rg-stepper">
                      <button type="button" aria-label="Fewer members" onClick={() => { set('crewSize', String(Math.max(1, crewN - 1))); touch('crewSize')() }} disabled={crewN <= 1}>−</button>
                      <div className="rg-box">
                        <span className="rg-ico"><Svg d={I.crew} /></span>
                        <input {...a11y('crewSize')} type="text" inputMode="numeric" pattern="[0-9]*" value={f.crewSize} onChange={onText('crewSize')} />
                      </div>
                      <button type="button" aria-label="More members" onClick={() => { set('crewSize', String(Math.min(10, crewN + 1))); touch('crewSize')() }} disabled={crewN >= 10}>+</button>
                    </div>
                    {show('crewSize') ? <p className="rg-err" id="rg-crewSize-err">{show('crewSize')}</p> : <p className="rg-hint">Total dancers including you — 1 for solo, up to 10 for a crew.</p>}
                  </div>
                </div>
              )}

              <fieldset className={'rg-field rg-set' + (show('style') ? ' bad' : '')} data-field="style">
                <legend>Dance style <em aria-hidden="true">*</em></legend>
                <div className="rg-chips">
                  {STYLES.map(s => (
                    <label key={s} className={'rg-chip' + (f.style === s ? ' on' : '')}>
                      <input type="radio" name="style" value={s} checked={f.style === s} onChange={() => { set('style', s); touch('style')() }} />{s}
                    </label>
                  ))}
                </div>
                {show('style') && <p className="rg-err">{show('style')}</p>}
              </fieldset>

              {f.style === 'Other' && (
                <div className="rg-grid rg-reveal-in">
                  <Field k="styleOther" label="Your dance style" icon={I.music} err={show('styleOther')} ok={ok('styleOther')}>
                    <input {...a11y('styleOther')} placeholder="e.g. Kathak, Bharatanatyam, Locking" maxLength={40} value={f.styleOther} onChange={onText('styleOther')} />
                  </Field>
                </div>
              )}

              {!battle && (
              <div className="rg-grid">
                <Field k="link" label="Dance Video Link" icon={I.link} err={show('link')} ok={ok('link')}
                       hint="Any link works — Instagram, YouTube, Google Drive, Facebook and more. Make sure it’s viewable by anyone.">
                  <input {...a11y('link')} type="text" inputMode="url" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="Paste your video link (Instagram, YouTube, Drive…)" maxLength={300} value={f.link} onChange={onText('link')} />
                </Field>
              </div>
              )}
            </Section>

            <div className={'rg-field rg-consent' + (show('consent') ? ' bad' : '')} data-field="consent">
              <label>
                <input type="checkbox" name="consent" checked={f.consent} onChange={e => { set('consent', e.target.checked); touch('consent')() }} />
                <span className="rg-check" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 10.5 3.2 3.2L15 7" /></svg></span>
                <span>
                  <>I agree to the <button type="button" className="rg-pol" onClick={openPolicy('terms')}>Terms &amp; Conditions</button>, <button type="button" className="rg-pol" onClick={openPolicy('rules')}>Rules &amp; Regulations</button> and <button type="button" className="rg-pol" onClick={openPolicy('privacy')}>Privacy Policy</button>.</>
                  {age != null && age < 18 ? <b> As the participant is under 18, I confirm I am their parent or legal guardian and give my consent.</b> : ' If the participant is under 18, I am their parent or legal guardian and give my consent.'}
                </span>
              </label>
              {show('consent') && <p className="rg-err">{show('consent')}</p>}
            </div>

            <div className="rg-action">
              <button className={'rg-btn rg-btn-lg' + (busy ? ' busy' : '')} type="submit" disabled={busy}>
                {busy ? <><span className="rg-spin" aria-hidden="true" />Saving…</> : <>Continue to payment <span aria-hidden="true">→</span></>}
              </button>
            </div>
          </form>
        )}

        {step === 1 && reg && (
          <div className="rg-pay rg-reveal-in">
            <h2>Payment</h2>
            <p className="rg-sub">Complete your payment to confirm registration <b>{reg.id}</b>.</p>
            <dl className="rg-summary">
              <div><dt>Name</dt><dd>{reg.name}</dd></div>
              {reg.category && <div><dt>Category</dt><dd>{reg.category}</dd></div>}
              {reg.crewSize > 0 && <div><dt>Crew members</dt><dd>{reg.crewSize}</dd></div>}
              <div><dt>Dance style</dt><dd>{reg.style}</dd></div>
              <div><dt>Audition city</dt><dd>{reg.city}</dd></div>
              <div className="rg-total"><dt>Registration fee <small className="rg-gst">(incl. GST)</small></dt><dd>₹{fee}</dd></div>
            </dl>
            {mock && (
              <div className="rg-mock" role="status">
                <b>Test mode</b> — Razorpay keys aren’t configured, so no real money is charged.
                <button type="button" className="rg-btn" onClick={payMock} disabled={busy}>{busy ? 'Processing…' : 'Simulate successful payment'}</button>
              </div>
            )}
            <div className="rg-action">
              <button type="button" className={'rg-btn rg-btn-lg' + (busy ? ' busy' : '')} onClick={pay} disabled={busy || !!mock}>
                {busy && !mock ? <><span className="rg-spin" aria-hidden="true" />Opening payment…</> : <>Pay ₹{fee} securely <span aria-hidden="true">→</span></>}
              </button>
            </div>
            <p className="rg-paynote">UPI · Cards · Net banking · Wallets — processed by Razorpay. <button type="button" className="rg-linkbtn" onClick={() => { setStep(0); setMock(null) }}>← Edit details</button></p>
          </div>
        )}

        {step === 2 && reg && (
          <div className="rg-success rg-reveal-in" role="status">
            <span className="rg-seal" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 10.5 3.2 3.2L15 7" /></svg></span>
            <h2>Registration Successful!</h2>
            <p className="rg-sub">Welcome to {SHOW}, {reg.name.split(' ')[0]}. A confirmation has been sent to {reg.email}.</p>
            <dl className="rg-summary">
              <div><dt>Registration ID</dt><dd className="rg-id">{reg.id}</dd></div>
              {reg.category && <div><dt>Category</dt><dd>{reg.category}</dd></div>}
              {reg.crewSize > 0 && <div><dt>Crew members</dt><dd>{reg.crewSize}</dd></div>}
              <div><dt>Dance type</dt><dd>{reg.style}</dd></div>
              <div><dt>Audition city</dt><dd>{reg.city}</dd></div>
              <div><dt>Payment ID</dt><dd>{reg.paymentId}</dd></div>
              <div><dt>Registration link</dt><dd><a href={`${BASE}?id=${reg.id}`}>{`${BASE}?id=${reg.id}`}</a></dd></div>
            </dl>
            <p className="rg-paynote">Save your Registration ID. We’ll share your audition date, venue and reporting time before auditions in {reg.city}.</p>
            <div className="rg-action"><button type="button" className="rg-btn rg-btn-lg ghost" onClick={restart}>Register another</button></div>
          </div>
        )}
      </div>
      <PolicyModal which={policy} onClose={closePolicy} />
    </div>
  )
}
