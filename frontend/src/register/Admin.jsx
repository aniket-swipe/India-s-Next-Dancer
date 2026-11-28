import { useState } from 'react'
import { api } from './api'

/** Minimal admin list at /register/?admin — needs ADMIN_TOKEN from backend/.env */
export default function Admin() {
  const [token, setToken] = useState('')
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const load = async e => {
    e?.preventDefault(); setErr('')
    try { setRows((await api.list(token)).registrations) } catch (x) { setErr(x.message) }
  }
  const list = (rows || []).filter(r => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))
  const paid = (rows || []).filter(r => r.status === 'COMPLETED').length
  const csv = () => {
    const cols = ['id', 'event', 'status', 'name', 'dob', 'age', 'city', 'mobile', 'altMobile', 'email', 'category', 'crewSize', 'style', 'styleOther', 'link', 'paymentId', 'paidAt', 'createdAt']
    const text = [cols.join(','), ...list.map(r => cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); a.download = 'registrations.csv'; a.click()
  }
  return (
    <section className="rg-admin wrap">
      <h1 className="rg-h2">Registrations <span>admin</span></h1>
      {!rows ? (
        <form className="rg-admin-login" onSubmit={load}>
          <input type="password" placeholder="Admin token" value={token} onChange={e => setToken(e.target.value)} autoComplete="current-password" />
          <button className="rg-btn" type="submit">Open</button>
          {err && <p className="rg-err">{err}</p>}
        </form>
      ) : (
        <>
          <div className="rg-admin-bar">
            <span>{rows.length} total · {paid} paid · {rows.length - paid} pending</span>
            <input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
            <button className="rg-btn ghost" onClick={load}>Refresh</button>
            <button className="rg-btn" onClick={csv}>Export CSV</button>
          </div>
          <div className="rg-table-wrap">
            <table className="rg-table">
              <thead><tr><th>Photo</th><th>ID</th><th>Event</th><th>Status</th><th>Name</th><th>Age</th><th>City</th><th>Category / Crew</th><th>Style</th><th>Mobile</th><th>Email</th><th>Link</th><th>Payment</th></tr></thead>
              <tbody>
                {list.map(r => (
                  <tr key={r.id}>
                    <td>{r.photo && <img src={r.photo} alt="" width="40" height="50" loading="lazy" />}</td>
                    <td>{r.id}</td>
                    <td>{r.event === 'BATTLE' ? 'Battle' : 'IND'}</td>
                    <td><span className={'rg-badge ' + (r.status === 'COMPLETED' ? 'ok' : 'wait')}>{r.status === 'COMPLETED' ? 'Paid' : 'Pending'}</span></td>
                    <td>{r.name}</td><td>{r.age}</td><td>{r.city}</td><td>{r.event === 'BATTLE' ? `${r.crewSize || 1} member${(r.crewSize || 1) > 1 ? 's' : ''}` : r.category}</td>
                    <td>{r.style === 'Other' ? r.styleOther : r.style}</td>
                    <td>{r.mobile}{r.altMobile && <><br /><small>{r.altMobile}</small></>}</td>
                    <td>{r.email}</td>
                    <td><a href={r.link} target="_blank" rel="noopener noreferrer">Open</a></td>
                    <td>{r.paymentId || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
