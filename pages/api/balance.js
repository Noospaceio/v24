// Simple JSON-file backed balance API
import fs from 'fs'
import path from 'path'

const DB = path.join(process.cwd(), 'data', 'db.json')

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(DB, 'utf8'))
  } catch (e) {
    return { balances: {}, unclaimed: {} }
  }
}
function writeDb(obj) {
  fs.writeFileSync(DB, JSON.stringify(obj, null, 2))
}

export default function handler(req, res) {
  const db = readDb()
  if (req.method === 'GET') {
    const { wallet } = req.query
    if (!wallet) return res.status(400).json({ error: 'missing wallet' })
    const bal = db.balances[wallet] || 0
    const unclaimed = db.unclaimed[wallet] || 0
    return res.status(200).json({ wallet, balance: bal, unclaimed })
  }
  if (req.method === 'POST') {
    const { wallet, delta, set } = req.body || {}
    if (!wallet) return res.status(400).json({ error: 'missing wallet' })
    const cur = db.balances[wallet] || 0
    if (typeof set === 'number') {
      db.balances[wallet] = set
    } else if (typeof delta === 'number') {
      db.balances[wallet] = Math.max(0, cur + delta)
    } else {
      return res.status(400).json({ error: 'missing delta or set' })
    }
    writeDb(db)
    return res.status(200).json({ ok: true, balance: db.balances[wallet] })
  }
  return res.status(405).json({ error: 'method not allowed' })
}