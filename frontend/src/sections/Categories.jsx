import { useRef } from 'react'
import { Glyphs } from '../components/Glyphs'
import { CATEGORIES, PRIZES } from '../content'
import { useInView } from '../hooks'

const first = PRIZES.find(p => p.place === '1st').amount
const second = PRIZES.find(p => p.place === '2nd').amount

function CatCard({ c, i }) {
  const ref = useRef(null)
  const Glyph = Glyphs[c.key]
  const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches

  const move = e => {
    if (!fine) return
    const el = ref.current, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', ((x - 0.5) * 16).toFixed(2) + 'deg')
    el.style.setProperty('--rx', ((0.5 - y) * 12).toFixed(2) + 'deg')
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%')
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%')
  }
  const leave = () => { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg') }

  return (
    <article className="cx-card" ref={ref} style={{ '--i': i }} onPointerMove={move} onPointerLeave={leave}>
      <div className="cx-inner">
        <span className="cx-glare" aria-hidden="true" />
        <span className="cx-index" aria-hidden="true">0{i + 1}</span>

        <div className="cx-head">
          <div className="cx-orb">
            <span className="cx-ring" aria-hidden="true" />
            <Glyph />
          </div>
          <span className="cx-pill">{c.format}</span>
        </div>

        <h3 className="cx-name">{c.title}</h3>
        <p className="cx-age"><span className="metal">{c.age}</span><small>{c.sub}</small></p>

        <dl className="cx-prize">
          <div><dt>1st</dt><dd>{first}</dd></div>
          <div><dt>2nd</dt><dd>{second}</dd></div>
        </dl>

        <a className="cx-cta" href="#notify">Get notified <span aria-hidden="true">→</span></a>
      </div>
    </article>
  )
}

export default function Categories() {
  const [ref, inView] = useInView(0.15)
  return (
    <section id="categories" className={'cx' + (inView ? ' in' : '')} ref={ref}>
      <div className="wrap">
        <div className="cx-top">
          <div>
            <p className="cx-kicker"><span />{CATEGORIES.length} categories · Freestyle</p>
            <h2 className="display cx-title" aria-label="Find your category">
              <span className="cx-line"><span>Find your</span></span>
              <span className="cx-line"><span className="metal">category</span></span>
            </h2>
          </div>
          <p className="cx-desc">
            Three solo categories split by age, plus a group category for crews of 2 to 10. Every category is
            freestyle, so any dance form is welcome.
          </p>
        </div>

        <div className="cx-grid">
          {CATEGORIES.map((c, i) => <CatCard key={c.key} c={c} i={i} />)}
        </div>

        <div className="cx-note">
          <span className="cx-note-badge">Dance style</span>
          <p><strong>Freestyle.</strong> Classical, folk, street, contemporary or a fusion of your own — all forms are welcome.</p>
        </div>
      </div>
    </section>
  )
}
