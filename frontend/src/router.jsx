import { createContext, forwardRef, useContext, useEffect, useState } from 'react'

/** Minimal client-side router (no dependency). Works during prerender via PathContext. */
export const PathContext = createContext(null)

export function navigate(to) {
  const url = new URL(to, location.origin)
  if (url.pathname === location.pathname && url.hash) {
    history.pushState(null, '', url.pathname + url.hash)
    document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  history.pushState(null, '', url.pathname + url.search + url.hash)
  dispatchEvent(new PopStateEvent('popstate'))
}

/** Current path, normalised to the canonical trailing-slash form, e.g. "/about/" */
const norm = p => { let x = (p || '/').toLowerCase().replace(/\/{2,}/g, '/'); return x.endsWith('/') ? x : x + '/' }

export function usePath() {
  const ssr = useContext(PathContext)
  const [path, setPath] = useState(() => ssr ?? location.pathname)
  useEffect(() => {
    const on = () => setPath(location.pathname)
    addEventListener('popstate', on)
    return () => removeEventListener('popstate', on)
  }, [])
  return norm(path)
}

/** Internal link: a real crawlable <a href>, upgraded to client navigation on click */
export const Link = forwardRef(function Link({ to, onClick, children, ...rest }, ref) {
  return (
    <a ref={ref} href={to} {...rest} onClick={e => {
      onClick?.(e)
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      navigate(to)
    }}>{children}</a>
  )
})
