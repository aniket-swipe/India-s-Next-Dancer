import { useEffect, useRef } from 'react'
import { PRIVACY, TERMS } from '../pages/Legal'
import { RULES } from '../pages/Policies'

export const POLICIES = {
  terms: { title: 'Terms & Conditions', sections: TERMS, href: '/terms-and-conditions/' },
  rules: { title: 'Rules & Regulations', sections: RULES, href: '/rules-and-regulations/' },
  privacy: { title: 'Privacy Policy', sections: PRIVACY, href: '/privacy-policy/' },
}

/** Scrollable policy pop-up — the visitor reads it without leaving the form. */
export default function PolicyModal({ which, onClose }) {
  const box = useRef(null)
  const doc = POLICIES[which]

  useEffect(() => {
    if (!doc) return
    const prevFocus = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    box.current?.querySelector('.rg-modal-close')?.focus()
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') { // keep focus inside the dialog
        const f = [...box.current.querySelectorAll('button, a[href]')]
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    addEventListener('keydown', onKey)
    return () => { removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; prevFocus?.focus?.() }
  }, [doc, onClose])

  if (!doc) return null
  return (
    <div className="rg-modal-back" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="rg-modal" role="dialog" aria-modal="true" aria-labelledby="rg-modal-title" ref={box}>
        <header className="rg-modal-head">
          <div>
            <p className="rg-modal-k">Effective Date: 25 November 2026</p>
            <h2 id="rg-modal-title">{doc.title}</h2>
          </div>
          <button type="button" className="rg-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="rg-modal-body" tabIndex={0}>
          {doc.sections.map((s, i) => (
            <section key={s.id} className="rg-modal-sec">
              <h3><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</h3>
              {s.body}
            </section>
          ))}
        </div>
        <footer className="rg-modal-foot">
          <a href={doc.href} target="_blank" rel="noopener noreferrer">Open full page ↗</a>
          <button type="button" className="rg-btn" onClick={onClose}>Done reading</button>
        </footer>
      </div>
    </div>
  )
}
