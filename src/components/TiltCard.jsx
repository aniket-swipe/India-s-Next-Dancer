import { useRef } from 'react'
import { prefersReducedMotion } from '../hooks'

/** Pointer-tracked 3D tilt with a light that follows the cursor. */
export default function TiltCard({ children }) {
  const ref = useRef(null)
  const enabled =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(pointer: fine)').matches &&
    !prefersReducedMotion()

  const onMove = e => {
    if (!enabled) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', ((x - 0.5) * 18).toFixed(2) + 'deg')
    el.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg')
    el.style.setProperty('--mx', (x * 100).toFixed(1) + '%')
    el.style.setProperty('--my', (y * 100).toFixed(1) + '%')
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <article className="card" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="card-inner">{children}</div>
    </article>
  )
}
