import { useEffect, useRef, useState } from 'react'

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Live countdown to an ISO timestamp. */
export function useCountdown(iso) {
  const target = new Date(iso).getTime()
  const calc = () => {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000))
    const d = Math.floor(s / 86400); s -= d * 86400
    const h = Math.floor(s / 3600);  s -= h * 3600
    const m = Math.floor(s / 60);    s -= m * 60
    return { d, h, m, s }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [iso])
  return t
}

export function useScrolled(offset = 40) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const h = () => setOn(scrollY > offset)
    addEventListener('scroll', h, { passive: true }); h()
    return () => removeEventListener('scroll', h)
  }, [offset])
  return on
}

/** True once the element has scrolled into view (fires once). */
export function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}
