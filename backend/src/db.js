// Tiny JSON-file database: everything lives in memory, every change is written
// atomically (temp file + rename) and writes are queued so they never overlap.
// Swap this module for MySQL later — see backend/schema.sql.
import fs from 'node:fs/promises'
import path from 'node:path'
import { config } from './config.js'

const FILE = path.join(config.dataDir, 'registrations.json')
const rows = new Map()
let queue = Promise.resolve()

export async function initDb() {
  await fs.mkdir(config.dataDir, { recursive: true })
  try {
    const list = JSON.parse(await fs.readFile(FILE, 'utf8'))
    for (const r of list) rows.set(r.id, r)
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  console.log(`[db] ${rows.size} registration(s) loaded from ${FILE}`)
}

function persist() {
  const snapshot = JSON.stringify([...rows.values()], null, 2)
  queue = queue.then(async () => {
    const tmp = `${FILE}.${process.pid}.tmp`
    await fs.writeFile(tmp, snapshot)
    await fs.rename(tmp, FILE)
  }).catch(e => console.error('[db] write failed', e))
  return queue
}

export const db = {
  get: id => rows.get(id) || null,
  all: () => [...rows.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  async insert(row) { rows.set(row.id, row); await persist(); return row },
  async update(id, patch) {
    const row = rows.get(id)
    if (!row) return null
    Object.assign(row, patch, { updatedAt: new Date().toISOString() })
    await persist()
    return row
  },
}

let last = 0
/** IDs look like IND1764150000123 — unique even within the same millisecond. */
export function newId() {
  let t = Date.now()
  if (t <= last) t = last + 1
  last = t
  return `IND${t}`
}
