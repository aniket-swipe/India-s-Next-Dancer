import { useRef } from 'react'
import { CATEGORIES, COMPANY, EVENT, STEPS } from '../content'
import { Link } from '../router'
import { PageHero, Reveal } from './PageShell'

const VALUES = [
  ['Every style', 'Freestyle means classical, folk, street, contemporary or your own fusion — all forms are welcome.'],
  ['Every age', `${CATEGORIES.length} categories: Kids, Teens and Adults as solos, plus a Group category for crews of 2 to 10.`],
  ['Every city', `Auditions run in ${EVENT.cities} major cities, so talent is found where it lives — not only in metros.`],
  ['One stage', 'Finalists from every city meet at a live national Grand Finale in Mumbai, in front of celebrity judges.'],
]

const STATS = [
  [EVENT.prizePool, 'Total prize pool'],
  [String(EVENT.cities), 'Audition cities'],
  [String(CATEGORIES.length), 'Categories'],
  [String(STEPS.length), 'Rounds to the finale'],
]

function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const move = e => {
    if (!matchMedia('(pointer: fine)').matches) return
    const el = ref.current, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg')
    el.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg')
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%')
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%')
  }
  const leave = () => { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg') }
  return <div ref={ref} className={'pg-tilt ' + className} onPointerMove={move} onPointerLeave={leave}><span className="pg-glare" aria-hidden="true" />{children}</div>
}

export default function About() {
  return (
    <>
      <PageHero
        kicker="About"
        title="About"
        gold={`${EVENT.name}`}
        intro={`${EVENT.name} ${EVENT.year} is a nationwide freestyle dance competition presented by ${COMPANY.name} — built to find India’s most exciting dancers, wherever they are.`}
      />

      <section className="pg-body">
        <div className="wrap">
          <div className="ab-split">
            <Reveal className="ab-story">
              <p className="pg-kick"><span />Our story</p>
              <h2 className="display ab-h">One stage.<br /><span className="metal">One dream.</span></h2>
              <p>
                Talent in India doesn’t only live in dance academies and big cities. It lives in school halls, street
                corners, temple courtyards and living rooms. {EVENT.name} exists to give every one of those dancers a
                fair shot at a national stage.
              </p>
              <p>
                The competition runs in three rounds — city auditions,  National  National Semifinals and a live National Grand Finale
                in Mumbai — with prize money for the top two in every category.
              </p>
            </Reveal>

            <Reveal className="ab-stats" delay={0.15}>
              {STATS.map(([v, l], i) => (
                <TiltCard key={l} className="ab-stat">
                  <b className="metal">{v}</b><span>{l}</span>
                  <i className="ab-stat-n" aria-hidden="true">0{i + 1}</i>
                </TiltCard>
              ))}
            </Reveal>
          </div>

          <Reveal className="ab-values-head">
            <p className="pg-kick"><span />What we stand for</p>
          </Reveal>
          <div className="ab-values">
            {VALUES.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.1}>
                <TiltCard className="ab-value">
                  <span className="ab-orb" aria-hidden="true"><span className="ab-ring" />{String(i + 1).padStart(2, '0')}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal className="ab-company">
            <TiltCard className="ab-company-card">
              <div>
                <p className="pg-kick"><span />Presented by</p>
                <h2 className="display ab-h"><span className="metal">{COMPANY.name}</span></h2>
                <p className="ab-muted">Registered in {COMPANY.registeredIn} · Parent: {COMPANY.parent}</p>
              </div>
              <address className="ab-addr">
                {COMPANY.address.map(l => <span key={l}>{l}</span>)}
                <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </address>
            </TiltCard>
          </Reveal>

          <Reveal className="ab-cta">
            <h2 className="display ab-h">Ready for <span className="metal">your stage?</span></h2>
            <div className="ab-cta-btns">
              <Link className="btn" to="/#notify">Get notified when registration opens</Link>
              <Link className="btn ghost" to="/#categories">See categories</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
