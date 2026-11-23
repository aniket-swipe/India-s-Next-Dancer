import { useEffect, useRef, useState } from 'react'
import { STEPS, EVENT } from '../content'
import { useInView } from '../hooks'

const TAGS = [
  [`${EVENT.cities} cities`, 'Open auditions'],
  ['City level', 'Selected performers'],
  ['Mumbai', 'Live · Celebrity judges'],
]

const ICONS = [
  <svg key="a" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 28s-8-7.6-8-14a8 8 0 0 1 16 0c0 6.4-8 14-8 14Z" /><circle cx="16" cy="14" r="3" /></svg>,
  <svg key="b" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4l3.5 7.2 7.9 1.1-5.7 5.6 1.4 7.9L16 22.1 8.9 25.8l1.4-7.9-5.7-5.6 7.9-1.1z" /></svg>,
  <svg key="c" viewBox="0 0 32 32" aria-hidden="true"><path d="M10 5h12v6a6 6 0 0 1-12 0V5Z" /><path d="M10 7H6v2a4 4 0 0 0 4 4M22 7h4v2a4 4 0 0 1-4 4M16 17v5M11 27h10M13 22h6l1 5h-8l1-5Z" /></svg>,
]

function StepCard({ s, i, coinRef }) {
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
  const last = i === STEPS.length - 1

  return (
    <li className={'jy-step' + (last ? ' jy-final' : '')} style={{ '--i': i }}>
      <div className="jy-card" ref={ref} onPointerMove={move} onPointerLeave={leave}>
        <span className="jy-glare" aria-hidden="true" />
        <div className="jy-head">
          <span className="jy-coin" aria-hidden="true" ref={coinRef}><span>{s.n}</span></span>
          <span className="jy-round">Round 0{s.n}</span>
          <span className="jy-ico">{ICONS[i]}</span>
        </div>
        <h3>{s.title}</h3>
        <p>{s.body}</p>
        <ul className="jy-tags">{TAGS[i].map(t => <li key={t}>{t}</li>)}</ul>
      </div>
    </li>
  )
}

export default function Journey() {
  const [ref, inView] = useInView(0.18)
  const stageRef = useRef(null)
  const coins = useRef([])
  const [geo, setGeo] = useState({ w: 100, h: 100, d: '' })

  // Draw the gold path exactly through the centre of each round's coin
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const r = stage.getBoundingClientRect()
      const pts = coins.current.filter(Boolean).map(c => {
        const b = c.getBoundingClientRect()
        return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2]
      })
      if (pts.length < 2) return
      let d = `M ${pts[0][0]} ${pts[0][1]}`
      for (let k = 1; k < pts.length; k++) {
        const [x0, y0] = pts[k - 1], [x1, y1] = pts[k], mx = (x0 + x1) / 2
        d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`
      }
      setGeo({ w: r.width, h: r.height, d })
    }
    measure()
    stage._measure = measure
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    addEventListener('resize', measure)
    return () => { ro.disconnect(); removeEventListener('resize', measure) }
  }, [])

  // cards slide in from below — re-measure once they have settled
  useEffect(() => {
    if (!inView) return
    const ids = [600, 1600, 2800].map(t => setTimeout(() => stageRef.current?._measure?.(), t))
    return () => ids.forEach(clearTimeout)
  }, [inView])
  return (
    <section id="journey" className={'jy' + (inView ? ' in' : '')} ref={ref}>
      <div className="wrap">
        <div className="jy-top">
          <div>
            <p className="jy-kicker"><span />The journey · {STEPS.length} rounds</p>
            <h2 className="display jy-title" aria-label="From your city to Mumbai">
              <span className="jy-line"><span>From your city</span></span>
              <span className="jy-line"><span>to <em className="metal">Mumbai</em></span></span>
            </h2>
          </div>
          <p className="jy-desc">The competition runs in three rounds, ending in a live national finale.</p>
        </div>

        <div className="jy-stage" ref={stageRef}>
          <svg className="jy-path" viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
            <defs>
              <linearGradient id="jyg" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#C77A12" /><stop offset=".5" stopColor="#F5B52E" /><stop offset="1" stopColor="#FFE7A8" />
              </linearGradient>
            </defs>
            <path className="jy-base" d={geo.d} />
            <path className="jy-draw" d={geo.d} pathLength="1" />
            <path className="jy-flow" d={geo.d} pathLength="100" />
          </svg>

          <ol className="jy-steps">
            {STEPS.map((s, i) => <StepCard key={s.n} s={s} i={i} coinRef={el => (coins.current[i] = el)} />)}
          </ol>
        </div>

        <p className="jy-note">
          <span className="jy-dot" aria-hidden="true" />
          Audition cities and dates will be announced when registration opens.
        </p>
      </div>
    </section>
  )
}
