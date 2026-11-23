import { EVENT } from '../content'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>Presented by <strong>{EVENT.presenter}</strong></span>
        <span>© 2026 {EVENT.presenter}. All rights reserved.</span>
      </div>
    </footer>
  )
}
