import { useEffect, useRef } from 'react'
import { COMPANY, EVENT } from '../content'
import { useInView } from '../hooks'
import { Link } from '../router'

const SocialIcon = {
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1.3 1.3-1.3H17V2.2h-2.6C11.6 2.2 10.6 4 10.6 6.5v2H8v3.3h2.6V22H14V11.8h2.6l.4-3.3H14Z" /></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1.1" className="fill" /></svg>
  ),
}

const Ico = {
  phone: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>,
  mail: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>,
  pin: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.6-7-12a7 7 0 0 1 14 0c0 5.4-7 12-7 12Z" /><circle cx="12" cy="9" r="2.6" /></svg>,
}

const LINK_GROUPS = [
  { title: 'Company', links: [
    { to: '/about/', label: 'About' },
  ] },
  { title: 'Legal', links: [
    { to: '/terms-and-conditions/', label: 'Terms & Conditions' },
    { to: '/privacy-policy/', label: 'Privacy Policy' },
    { to: '/cookie-policy/', label: 'Cookie Policy' },
    { to: '/disclaimer/', label: 'Disclaimer' },
  ] },
  { title: 'Competition', links: [
    { to: '/rules-and-regulations/', label: 'Rules & Regulations' },
    { to: '/payment-and-refund-policy/', label: 'Payment & Refund Policy' },
    { to: '/cancellation-policy/', label: 'Cancellation Policy' },
    { to: '/child-safety/', label: 'Child Safety' },
  ] },
]

/** Scales the big wordmark so the whole name always fits the footer width */
function useFitText() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = '100px'
      const w = el.parentElement.clientWidth
      el.style.fontSize = Math.max(18, Math.floor((100 * w * 0.97) / el.scrollWidth)) + 'px'
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [])
  return ref
}

export default function Footer() {
  const [ref, inView] = useInView(0.12)
  const wordRef = useFitText()
  return (
    <footer className={'ft' + (inView ? ' in' : '')} ref={ref}>
      <div className="ft-glow" aria-hidden="true" />
      <div className="wrap">
        <div className="ft-grid">
          {/* brand */}
          <div className="ft-col ft-brand" style={{ '--i': 0 }}>
            <Link to="/" className="ft-logo" aria-label={`${EVENT.name} ${EVENT.year} — home`}>
              <span className="ft-logo-3d"><picture><source srcSet="/images/indias-next-dancer-icon-96.webp 1x, /images/indias-next-dancer-icon-192.webp 2x" type="image/webp" /><img src="/images/indias-next-dancer-icon-96.png" srcSet="/images/indias-next-dancer-icon-192.png 2x" alt="" width="64" height="64" loading="lazy" decoding="async" /></picture></span>
              <span className="ft-logo-text"><b>{EVENT.name}</b><small>{EVENT.year} · {COMPANY.name}</small></span>
            </Link>
            <p className="ft-tag">One stage. One dream. A nationwide freestyle dance competition across {EVENT.cities} cities.</p>
            <div className="ft-social">
              {COMPANY.social.map(s => (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`} className="ft-coin">
                  <span className="ft-coin-in"><span className="ft-coin-face">{SocialIcon[s.key]}</span><span className="ft-coin-face ft-coin-back">{SocialIcon[s.key]}</span></span>
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {LINK_GROUPS.map((g, i) => (
            <nav className="ft-col" key={g.title} style={{ '--i': i + 1 }} aria-label={g.title}>
              <h3 className="ft-h">{g.title}</h3>
              <ul className="ft-list ft-links">
                {g.links.map(l => <li key={l.to}><Link to={l.to}><span>{l.label}</span></Link></li>)}
              </ul>
            </nav>
          ))}
        </div>

        {/* contact strip */}
        <div className="ft-info">
          <a href={COMPANY.phoneHref} className="ft-col ft-contact ft-tile" style={{ '--i': 4 }}>
            <span className="ft-ico">{Ico.phone}</span><span><small>Mobile</small>{COMPANY.phone}</span>
          </a>
          <a href={`mailto:${COMPANY.email}`} className="ft-col ft-contact ft-email ft-tile" style={{ '--i': 5 }}>
            <span className="ft-ico">{Ico.mail}</span><span><small>Email</small>{COMPANY.email}</span>
          </a>
          <address className="ft-col ft-contact ft-tile ft-office" style={{ '--i': 6 }}>
            <span className="ft-ico">{Ico.pin}</span>
            <span><small>Registered office</small>{COMPANY.address.join(', ')}</span>
          </address>
        </div>

        <div className="ft-word-wrap" aria-hidden="true"><div className="ft-word" ref={wordRef}>India’s Next Dancer</div></div>

        <div className="ft-bottom">
          <span>Presented by <strong>{COMPANY.name}</strong></span>
          <span>© 2026 {COMPANY.name}. All rights reserved.</span>
          <button className="ft-top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
