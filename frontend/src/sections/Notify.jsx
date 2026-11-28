import { CATEGORIES, EVENT } from '../content'
import { useInView } from '../hooks'
import { Link } from '../router'

const CHOICES = [
  { to: '/register/', badge: 'Your golden ticket', title: 'Register for IND', stub: `Auditions ${EVENT.year}`,
    text: `Solo or crew, every style. Audition in your city for ${EVENT.name} ${EVENT.year}.`, cta: 'Register for IND' },
  { to: '/battle-register/', badge: 'Battle entry', title: 'Register for Battle', stub: `Battle ${EVENT.year}`,
    text: 'Step into the circle and take on other dancers head-to-head.', cta: 'Register for Battle' },
]
const PERKS = [
  ['Audition date for your city', 'Sent to your mobile the moment it’s announced'],
  ['First to register', 'Hear before registrations open publicly'],
  [`${CATEGORIES.length} categories, every style`, 'Kids, Teens, Adults or a Group crew'],
]

export default function Notify() {
  const [ref, inView] = useInView(0.2)
  const tilt = e => {
    if (!matchMedia('(pointer: fine)').matches) return
    const el = e.currentTarget, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg')
    el.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg')
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%')
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%')
  }
  const untilt = e => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg') }

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

        <div className="nt-stage nt-choices">
          {CHOICES.map((c, i) => (
            <Link key={c.title} to={c.to} className={'nt-choice' + (i ? ' alt' : '')} style={{ '--i': i }}
                  onPointerMove={tilt} onPointerLeave={untilt}>
              <span className="nt-glare" aria-hidden="true" />
              <div className="nt-choice-body">
                <span className="nt-badge">{c.badge}</span>
                <h3 className="display">{c.title}</h3>
                <p>{c.text}</p>
                <span className={'btn nt-choice-btn' + (i ? ' ghost' : '')}>{c.cta} <span aria-hidden="true">→</span></span>
              </div>
              <div className="nt-stub" aria-hidden="true">
                <span>{c.stub}</span>
                <i className="nt-barcode" />
              </div>
            </Link>
          ))}
          <div className="nt-shadow" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
