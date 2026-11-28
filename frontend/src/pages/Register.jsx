import { useEffect, useRef, useState } from 'react'
import { EVENT } from '../content'
import { useInView } from '../hooks'
import { Link } from '../router'
import RegisterForm from '../register/RegisterForm'
import Admin from '../register/Admin'
import { api } from '../register/api'
import { DEADLINE, FEE } from '../register/config'
import '../styles/register.css'

const HOW = [
  ['Fill in your details', 'Take a live photo, add your details, category, dance style and a link to your dancing.'],
  ['Pay ₹FEE securely', 'Pay the registration fee through Razorpay using UPI, card, net banking or a wallet.'],
  ['Get your audition call', 'You get a Registration ID instantly. Audition date, venue and time follow for your city.'],
]

const FAQ = [
  ['Who can register?', 'Anyone aged 5 or above. Solo dancers register as Kids (up to 12), Teen (13–19) or Adults (20+). Crews of 2–10 register in the Group category.'],
  ['What is the registration fee?', 'The fee is ₹FEE per registration, inclusive of GST, paid online through Razorpay. See the Payment & Refund Policy for refunds.'],
  ['Why do you need a live photo?', 'It helps us verify participants at the audition. The photo is taken with your camera and is used only for the competition.'],
  ['What link should I add?', 'A link to your dancing — an Instagram profile or reel, a YouTube video or any public page. Instagram profiles must be public so the judges can watch.'],
  ['Can a parent register a child?', 'Yes. For participants under 18, a parent or legal guardian must fill in the form and give consent. A guardian must accompany them at the audition.'],
  ['Which dance styles are allowed?', 'Every style. It’s freestyle — choose Folk, Freestyle, Hip Hop, Popping or Krump, or pick Other and tell us yours.'],
  ['When will I get my audition date?', 'Audition dates, venues and reporting times are shared with registered participants by email and phone before the auditions in each city.'],
  ['I paid but didn’t get a confirmation. What now?', 'Email support@kgilproduction.com or call +91 98366 76837 with your payment ID. We’ll confirm your registration.'],
]

function useCountdown(target) {
  const [now, setNow] = useState(null)
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  if (now == null) return null
  const ms = Math.max(0, new Date(target).getTime() - now)
  return { ms, d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 }
}

function Flip({ v, label }) {
  const t = v == null ? '--' : String(v).padStart(2, '0')
  return (
    <div className="rg-flip">
      <span className="rg-flip-card">{t.split('').map((c, i) => <b key={i + c} className="rg-digit">{c}</b>)}</span>
      <small>{label}</small>
    </div>
  )
}

function Reveal({ as: Tag = 'div', className = '', children, i = 0, ...rest }) {
  const [ref, inView] = useInView(0.15)
  return <Tag ref={ref} className={'rg-rv ' + className + (inView ? ' in' : '')} style={{ '--i': i }} {...rest}>{children}</Tag>
}

export default function Register({ battle = false }) {
  const NAME = battle ? 'India’s Next Battle' : EVENT.name
  const [cfg, setCfg] = useState({ fee: FEE, deadline: DEADLINE })
  const [admin, setAdmin] = useState(false)
  const pageRef = useRef(null)
  // Battle page: reveal each form section / field group as it scrolls into view
  useEffect(() => {
    if (!battle || !pageRef.current) return
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12 })
    const watch = () => pageRef.current?.querySelectorAll('.rg-sec:not(.in), .rg-consent:not(.in), .rg-pay:not(.in), .rg-success:not(.in)').forEach(el => io.observe(el))
    watch()
    const mo = new MutationObserver(watch)
    mo.observe(pageRef.current, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [battle])
  useEffect(() => {
    setAdmin(new URLSearchParams(location.search).has('admin'))
    api.config().then(c => setCfg(c)).catch(() => {})
  }, [])
  const cd = useCountdown(cfg.deadline)
  const closed = cd ? cd.ms === 0 : false
  const fee = cfg.fee
  const fill = s => s.replace('FEE', fee)

  if (admin) return <div className="rg-page"><Admin /></div>

  return (
    <div className={'rg-page' + (battle ? ' rg-battle' : '')} ref={pageRef}>
      {/* ---------- hero ---------- */}
      <header className="rg-hero">
        <div className="rg-hero-glow" aria-hidden="true" />
        {battle && (
          <div className="rg-arena" aria-hidden="true">
            <span className="rg-spot l" /><span className="rg-spot r" />
            <span className="rg-floor" />
            <span className="rg-embers">{Array.from({ length: 26 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</span>
          </div>
        )}
        <div className="wrap rg-hero-in">
          <div className="rg-hero-copy">
            <span className={'rg-badge-hot' + (closed ? ' off' : '')}><i />{closed ? 'Registrations closed' : 'Closing soon'}</span>
            {battle ? (
              <h1 className="rg-h1 rg-slam" aria-label={`Register for ${NAME} ${EVENT.year}`}>
                {['Register for', NAME, EVENT.year].map((t, i) => (
                  <span key={t} className={'rg-slam-l' + (i === 1 ? ' gold' : '')} style={{ '--l': i }} aria-hidden="true">{t}</span>
                ))}
              </h1>
            ) : (
              <h1 className="rg-h1">Register for <span>{NAME}</span> {EVENT.year}</h1>
            )}
            <p className="rg-lede">One national stage. Ten cities. Every age and every style. Secure your audition spot in a few minutes.</p>
            <div className="rg-early" role="status">
                <span className="rg-early-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7Z" /></svg>
                </span>
                <span className="rg-early-txt"><b>Early Bird Registrations</b><span>Now open</span></span>
                <i className="rg-early-shine" aria-hidden="true" />
              </div>
            <div className="rg-hero-cta">
              <div className="rg-hero-fee"><small>Registration fee</small><b>₹{fee}</b><small className="rg-gst">Incl. GST</small></div>
              {closed ? <span className="rg-btn rg-btn-lg disabled" aria-disabled="true">Registrations Closed</span>
                : <a className="rg-btn rg-btn-lg" href="#register-form">Register Now <span aria-hidden="true">→</span></a>}
            </div>
          </div>
          <div className="rg-hero-art" aria-hidden="true">
            <span className="rg-orbit" /><span className="rg-orbit o2" />
            <picture><source srcSet={`/images/indias-next-${battle ? 'battle' : 'dancer'}-2027-logo-600.webp`} type="image/webp" /><img src={`/images/indias-next-${battle ? 'battle' : 'dancer'}-2027-logo.jpg`} alt="" width="600" height="600" /></picture>
          </div>
        </div>
      </header>

      {/* ---------- about ---------- */}
      <section className="rg-sec-wrap">
        <div className="wrap rg-about">
          <Reveal>
            <p className="rg-kick">About the audition</p>
            <h2 className="rg-h2">Your stage is <span>waiting</span></h2>
          </Reveal>
          <Reveal i={1}>
            <p className="rg-p">{NAME} {EVENT.year} is a nationwide freestyle dance {battle ? 'battle' : 'competition'} by KGIL Productions. Audition in your city, go through the city semifinals and win a place at the live National Grand Finale in Mumbai.</p>
            <ul className="rg-facts">
              <li><b>10</b><span>Audition cities</span></li>
              <li><b>4</b><span>Categories</span></li>
              <li><b>₹5L</b><span>1st prize per category</span></li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="rg-sec-wrap">
        <div className="wrap">
          <Reveal><p className="rg-kick">How it works</p><h2 className="rg-h2">Three steps to <span>the stage</span></h2></Reveal>
          <ol className="rg-how">
            {HOW.map(([t, d], i) => (
              <Reveal as="li" key={t} i={i} className="rg-how-card">
                <span className="rg-how-n">0{i + 1}</span>
                <h3>{fill(t)}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- form ---------- */}
      <section className="rg-sec-wrap" id="register-form">
        <div className="wrap">
          <Reveal><p className="rg-kick">Registration form</p><h2 className="rg-h2">Claim your <span>audition spot</span></h2></Reveal>
          <RegisterForm fee={fee} deadline={cfg.deadline} closed={closed} battle={battle} />
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="rg-sec-wrap">
        <div className="wrap rg-faq">
          <Reveal><p className="rg-kick">FAQ</p><h2 className="rg-h2">You asked. <span>We answered.</span></h2></Reveal>
          <div>
            {FAQ.map(([q, a], i) => (
              <Reveal as="details" key={q} i={i} className="rg-q">
                <summary>{q}</summary>
                <p>{fill(a)}</p>
              </Reveal>
            ))}
            <p className="rg-p rg-more">More questions? Read the <Link to="/rules-and-regulations/">Rules &amp; Regulations</Link> or email <a href="mailto:support@kgilproduction.com">support@kgilproduction.com</a>.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export const BattleRegister = () => <Register battle />
