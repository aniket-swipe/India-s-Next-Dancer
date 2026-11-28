import { useEffect, useRef, useState } from 'react'

/** Live camera capture (getUserMedia) → JPEG data URL. No file upload by design. */
export default function Camera({ value, onChange, error }) {
  const video = useRef(null)
  const stream = useRef(null)
  const [state, setState] = useState(value ? 'done' : 'idle') // idle | starting | live | done | denied | unsupported
  const [msg, setMsg] = useState('')

  const stop = () => { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null }
  useEffect(() => stop, [])
  useEffect(() => { if (value && state !== 'done') setState('done') }, [value])

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unsupported')
      setMsg(window.isSecureContext ? 'Your browser can’t open the camera. Try Chrome or Safari.' : 'The camera only works on a secure (https) page.')
      return
    }
    setState('starting'); setMsg('')
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 1280 } }, audio: false })
      setState('live')
      requestAnimationFrame(() => { if (video.current) { video.current.srcObject = stream.current; video.current.play().catch(() => {}) } })
    } catch (e) {
      setState('denied')
      setMsg(e.name === 'NotAllowedError' ? 'Camera permission was blocked. Allow camera access in your browser settings, then try again.' : 'No camera found or it’s being used by another app.')
    }
  }

  const capture = () => {
    const v = video.current
    if (!v?.videoWidth) return
    const W = 600, H = 750, r = W / H
    let sw = v.videoWidth, sh = v.videoHeight
    if (sw / sh > r) sw = sh * r; else sh = sw / r
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const g = c.getContext('2d')
    g.translate(W, 0); g.scale(-1, 1) // un-mirror the selfie preview
    g.drawImage(v, (v.videoWidth - sw) / 2, (v.videoHeight - sh) / 2, sw, sh, 0, 0, W, H)
    onChange(c.toDataURL('image/jpeg', 0.85))
    stop(); setState('done')
  }

  const retake = () => { onChange(''); start() }

  return (
    <div className={'rg-cam' + (error ? ' bad' : '')}>
      <div className="rg-cam-frame">
        {state === 'done' && value && <img src={value} alt="Your profile photo" />}
        {(state === 'live' || state === 'starting') && <video ref={video} playsInline muted className="rg-cam-video" />}
        {state === 'live' && <span className="rg-cam-guide" aria-hidden="true" />}
        {!['done', 'live', 'starting'].includes(state) && (
          <div className="rg-cam-empty">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4Z" /><circle cx="12" cy="13" r="3.5" /></svg>
            <span>No photo yet</span>
          </div>
        )}
        {state === 'starting' && <span className="rg-spin rg-cam-spin" aria-label="Opening camera" />}
      </div>
      <div className="rg-cam-side">
        <div className="rg-cam-btns">
          {state === 'live' && <button type="button" className="rg-btn" onClick={capture}><span className="rg-shutter" aria-hidden="true" />Capture photo</button>}
          {state === 'live' && <button type="button" className="rg-btn ghost" onClick={() => { stop(); setState(value ? 'done' : 'idle') }}>Cancel</button>}
          {state === 'done' && <button type="button" className="rg-btn ghost" onClick={retake}>↺ Retake photo</button>}
          {['idle', 'denied', 'unsupported'].includes(state) && <button type="button" className="rg-btn" onClick={start} name="photo">Open camera</button>}
        </div>
        {msg && <p className="rg-err" role="alert">{msg}</p>}
        <ul className="rg-tips">
          <li>Face the camera in good, even light</li>
          <li>Plain background, no filters or sunglasses</li>
          <li>Head and shoulders inside the frame</li>
        </ul>
      </div>
    </div>
  )
}
