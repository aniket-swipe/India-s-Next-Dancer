import { useEffect, useRef, useState } from 'react'
import { EVENT, CATEGORIES } from '../content'

const STYLES = ['Hip-hop', 'Bharatanatyam', 'Contemporary', 'Bollywood', 'Kathak', 'Krump', 'Folk', 'Fusion']

const Icon = {
  prize: (
    <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 5h12v6a6 6 0 0 1-12 0V5Z" /><path d="M10 7H6v2a4 4 0 0 0 4 4M22 7h4v2a4 4 0 0 1-4 4M16 17v5M11 27h10M13 22h6l1 5h-8l1-5Z" /></svg>
  ),
  city: (
    <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 28s-8-7.6-8-14a8 8 0 0 1 16 0c0 6.4-8 14-8 14Z" /><circle cx="16" cy="14" r="3" /></svg>
  ),
  cat: (
    <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="2" /><rect x="18" y="5" width="9" height="9" rx="2" /><rect x="5" y="18" width="9" height="9" rx="2" /><rect x="18" y="18" width="9" height="9" rx="2" /></svg>
  ),
  date: (
    <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="7" width="22" height="20" rx="3" /><path d="M5 13h22M11 4v6M21 4v6" /><path d="m13 20 2.5 2.5L20 18" /></svg>
  ),
}

const STATS = [
  { key: 'prize', label: 'Total prize pool', value: 28, prefix: '₹', suffix: ' lakh', note: '₹5L + ₹2L in each category' },
  { key: 'city', label: 'Audition cities', value: EVENT.cities, note: 'City Auditions &  National Semifinals' },
  { key: 'cat', label: 'Categories', value: CATEGORIES.length, note: 'Kids · Teens · Adults · Group' },
  { key: 'date', label: 'Grand Finale', text: 'July', sub: '2027', note: 'Mumbai' },
]

/** Counts up once the stats scroll into view. */
function useCountUp(target, run, ms = 1400) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run || target == null) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(target)
    let raf, t0
    const step = t => {
      t0 ??= t
      const k = Math.min(1, (t - t0) / ms)
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, target, ms])
  return n
}

function Stat({ s, run, i }) {
  const n = useCountUp(s.value, run)
  const ref = useRef(null)
  const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches
  const move = e => {
    if (!fine) return
    const el = ref.current, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg')
    el.style.setProperty('--rx', ((0.5 - y) * 12).toFixed(2) + 'deg')
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%')
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%')
  }
  const leave = () => { const el = ref.current; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }
  return (
    <div className="mf-stat" ref={ref} style={{ '--i': i }} onPointerMove={move} onPointerLeave={leave}>
      <span className="mf-glare" aria-hidden="true" />
      <span className="mf-ico">{Icon[s.key]}</span>
      <dt>{s.label}</dt>
      <dd className="metal">
        {s.text ? <>{s.text}<small className="mf-year">{s.sub}</small></> : <>{s.prefix}{n}{s.suffix && <small>{s.suffix}</small>}</>}
      </dd>
      <p>{s.note}</p>
    </div>
  )
}

export default function Manifesto() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setInView(true), io.disconnect()), { threshold: 0.25 })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // Section-wide pointer parallax for the 3D headline
  const onMove = e => {
    if (!matchMedia('(pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    ref.current.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  const onLeave = () => { ref.current.style.setProperty('--px', 0); ref.current.style.setProperty('--py', 0) }

  const lines = ['One stage.', 'One dream.']
  return (
    <section className={'mf' + (inView ? ' in' : '')} ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="wrap">
        <div className="mf-top">
          <div className="mf-stage3d">
            <h2 className="display mf-title" aria-label="One stage. One dream.">
              {lines.map((t, i) => (
                <span className="mf-line" key={t} style={{ '--l': i }} aria-hidden="true">
                  <span className="mf-ghost">{t}</span>
                  <span className="mf-ghost mf-ghost2">{t}</span>
                  <span className="metal">{t}</span>
                </span>
              ))}
            </h2>
            <span className="mf-orbit" aria-hidden="true" />
          </div>
          <div className="mf-copy">
            <p className="mf-kicker"><span />The competition</p>
            <p className="mf-lead">
              Whether you’re dancing for the first time or you’ve trained for years, {EVENT.name} {EVENT.year} is
              your chance to perform on a national stage.
            </p>
            <p className="mf-sub">Freestyle means the style is yours to choose.</p>
          </div>
        </div>

        <div className="mf-belt" aria-label="Dance styles welcome">
          {[0, 1].map(row => (
            <div className={'mf-track' + (row ? ' rev' : '')} key={row} aria-hidden={row ? 'true' : undefined}>
              {[...STYLES, ...STYLES].map((s, i) => (
                <span key={i} className="mf-style">{s}<i>✦</i></span>
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
