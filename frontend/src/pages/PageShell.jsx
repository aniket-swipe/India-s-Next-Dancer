import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks'
import { Link } from '../router'

/** 3D page header shared by About / Privacy / Terms */
export function PageHero({ kicker, title, gold, intro, meta }) {
  const ref = useRef(null)
  const move = e => {
    if (!matchMedia('(pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    ref.current.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  return (
    <header className="pg-hero" ref={ref} onPointerMove={move}>
      <div className="pg-rings" aria-hidden="true"><i /><i /><i /></div>
      <div className="pg-dust" aria-hidden="true">{Array.from({ length: 22 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</div>
      <div className="wrap pg-hero-in">
        <nav className="pg-crumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{kicker}</span></nav>
        <h1 className="display pg-title" aria-label={`${title} ${gold || ''}`.trim()}>
          <span className="pg-line"><span>{title}</span></span>
          {gold && <span className="pg-line"><span className="metal">{gold}</span></span>}
        </h1>
        {intro && <p className="pg-intro">{intro}</p>}
        {meta && <p className="pg-meta">{meta}</p>}
      </div>
    </header>
  )
}

/** A block that tilts up into view */
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, inView] = useInView(0.12)
  return (
    <Tag ref={ref} className={'pg-reveal ' + className + (inView ? ' in' : '')} style={{ '--d': `${delay}s` }} {...rest}>
      {children}
    </Tag>
  )
}

/** Legal document layout: sticky 3D contents rail + numbered section cards */
export function LegalDoc({ sections }) {
  const [active, setActive] = useState(sections[0].id)
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -55% 0px' }
    )
    sections.forEach(s => { const el = document.getElementById(s.id); el && io.observe(el) })
    return () => io.disconnect()
  }, [sections])

  const go = id => e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <section className="pg-body">
      <div className="wrap pg-doc">
        <aside className="pg-toc" aria-label="On this page">
          <p className="pg-toc-h">On this page</p>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id} className={active === s.id ? 'on' : ''}>
                <a href={`#${s.id}`} onClick={go(s.id)}><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</a>
              </li>
            ))}
          </ol>
        </aside>
        <div className="pg-sections">
          {sections.map((s, i) => (
            <Reveal as="article" key={s.id} id={s.id} className="pg-card">
              <span className="pg-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h2>{s.title}</h2>
              {s.body}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
