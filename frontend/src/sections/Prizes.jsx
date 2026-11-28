import { useEffect, useRef, useState } from 'react'
import { CATEGORIES } from '../content'
import { useInView } from '../hooks'

const FIRST = 500000
const SECOND = 200000
const POOL = (FIRST + SECOND) * CATEGORIES.length
const inr = n => '₹' + n.toLocaleString('en-IN')

function useCount(target, run, ms = 1800) {
  // real value in the prerendered HTML; the count-up only runs in the browser once visible
  const [n, setN] = useState(target)
  useEffect(() => {
    if (!run) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(target)
    let raf, t0
    const step = t => {
      t0 ??= t
      const k = Math.min(1, (t - t0) / ms)
      setN(Math.round(target * (1 - Math.pow(1 - k, 4))))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, target, ms])
  return n
}

const EDGE = 14 // stacked layers that give each medal real thickness

function Medal({ place, sup, amount, cls }) {
  return (
    <div className={'pz-medal ' + cls}>
      <div className="pz-ribbon" aria-hidden="true"><i /><i /></div>
      <div className="pz-spin">
        <div className="pz-coin">
          {Array.from({ length: EDGE }, (_, k) => (
            <span key={k} className="pz-edge" style={{ '--z': k }} aria-hidden="true" />
          ))}
          <div className="pz-cface pz-cfront">
            <span className="pz-laurel" aria-hidden="true" />
            <span className="pz-cplace">{place}<sup>{sup}</sup></span>
            <span className="pz-camt">{amount}</span>
            <span className="pz-cper">per category</span>
          </div>
          <div className="pz-cface pz-cback" aria-hidden="true">
            <span className="pz-cback-t">India’s Next Dancer</span>
            <span className="pz-cback-p">{place}<sup>{sup}</sup> place</span>
            <span className="pz-cback-y">× {CATEGORIES.length} categories</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Prizes() {
  const [ref, inView] = useInView(0.2)
  const pool = useCount(POOL, inView)
  const stage = useRef(null)

  const move = e => {
    if (!matchMedia('(pointer: fine)').matches) return
    const r = stage.current.getBoundingClientRect()
    stage.current.style.setProperty('--sx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    stage.current.style.setProperty('--sy', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  const leave = () => { stage.current.style.setProperty('--sx', 0); stage.current.style.setProperty('--sy', 0) }

  return (
    <section id="prizes" className={'pz' + (inView ? ' in' : '')} ref={ref}>
      <div className="wrap pz-grid">
        <div className="pz-copy">
          <p className="pz-kicker"><span />Prize money</p>
          <h2 className="display pz-title" aria-label="Two winners in every category">
            <span className="pz-line"><span>Two winners</span></span>
            <span className="pz-line"><span className="metal">in every category</span></span>
          </h2>
          <p className="pz-desc">
            Each of the four categories crowns a first and second place winner, so eight dancers or crews take
            home prize money.
          </p>

          <div className="pz-pool">
            <span className="pz-pool-label">Total prize pool</span>
            <strong className="metal">{inr(pool)}</strong>
            <span className="pz-pool-sub">{CATEGORIES.length} categories × ({inr(FIRST)} + {inr(SECOND)})</span>
          </div>

          <ul className="pz-cats">
            {CATEGORIES.map((c, i) => (
              <li key={c.key} style={{ '--i': i }}><b>{c.title}</b><span>{c.age} · {c.format}</span></li>
            ))}
          </ul>
        </div>

        <div className="pz-stage" ref={stage} onPointerMove={move} onPointerLeave={leave} aria-label="1st place ₹5,00,000 and 2nd place ₹2,00,000 in each category">
          <div className="pz-beams" aria-hidden="true"><i /><i /></div>
                    <div className="pz-sparks" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--k': i }} />)}
          </div>

          <div className="pz-scene">
            <Medal place="2" sup="nd" amount={inr(SECOND)} cls="pz-m2" />
            <Medal place="1" sup="st" amount={inr(FIRST)} cls="pz-m1" />
            <div className="pz-floor" aria-hidden="true" />
          </div>
          <p className="pz-hint" aria-hidden="true">Hover a medal to flip it</p>
        </div>
      </div>
    </section>
  )
}
