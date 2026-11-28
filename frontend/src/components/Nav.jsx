import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
import { EVENT } from '../content'
import { useScrolled } from '../hooks'
import { Link, usePath } from '../router'

const LINKS = [
  { id: 'categories', label: 'Categories' },
  { id: 'prizes', label: 'Prizes' },
  { id: 'journey', label: 'Journey' },
  { id: 'ind', label: 'IND', href: '/register/' },
  { id: 'battle', label: 'Battle', href: '/battle-register/' },
]

export default function Nav() {
  const scrolled = useScrolled()
  const path = usePath()
  const home = path === '/'
  const to = id => (home ? `#${id}` : `/#${id}`)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const linkRefs = useRef({})
  const [pill, setPill] = useState({ x: 0, w: 0, on: false })

  // Highlight the section currently in view (nothing while on the hero or other sections)
  useEffect(() => {
    setActive(path === '/register/' ? 'ind' : path === '/battle-register/' ? 'battle' : '')
    if (!home) return
    const ids = ['top', ...LINKS.map(l => l.id), 'notify']
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return
        setActive(LINKS.some(l => l.id === e.target.id) ? e.target.id : '')
      }),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [path, home])

  // Slide the gold indicator under the active link
  useIsoLayoutEffect(() => {
    const place = () => {
      const el = linkRefs.current[active]
      setPill(el ? { x: el.offsetLeft, w: el.offsetWidth, on: true } : p => ({ ...p, on: false }))
    }
    place()
    addEventListener('resize', place)
    return () => removeEventListener('resize', place)
  }, [active])

  // Lock scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = e => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header id="nav" className={'nav' + (scrolled ? ' scrolled' : '') + (open ? ' open' : '')}>
      <Link className="brand" to="/" aria-label={`${EVENT.name} ${EVENT.year} — home`} onClick={() => setOpen(false)}>
        <picture><source srcSet="/images/indias-next-dancer-icon-96.webp 1x, /images/indias-next-dancer-icon-192.webp 2x" type="image/webp" /><img src="/images/indias-next-dancer-icon-96.png" srcSet="/images/indias-next-dancer-icon-192.png 2x" alt="" className="brand-logo" width="46" height="46" decoding="async" /></picture>
        <span className="brand-text">
          <b>{EVENT.name}</b>
          <small>{EVENT.presenter}</small>
        </span>
      </Link>

      <nav aria-label="Sections" className="nav-links">
        <span className={'nav-pill' + (pill.on ? ' on' : '')} aria-hidden="true"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />
        {LINKS.map(l => (
          <Link key={l.id} to={l.href || to(l.id)} ref={el => (linkRefs.current[l.id] = el)} className={active === l.id ? 'active' : ''}
             aria-current={active === l.id ? 'true' : undefined} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link className="btn btn-sm nav-cta-mobile" to={to('notify')} onClick={() => setOpen(false)}>Get notified</Link>
      </nav>

      <Link className="btn btn-sm nav-cta" to={to('notify')}>Get notified</Link>

      <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
              onClick={() => setOpen(o => !o)}>
        <span /><span /><span />
      </button>
    </header>
  )
}
