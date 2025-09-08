// Sacrifice endpoint: subtracts amount from wallet balance (server-side enforced)
import fs from 'fs'
import path from 'path'

const DB = path.join(process.cwd(), 'data', 'db.json')
function readDb() {
  try { return JSON.parse(fs.readFileSync(DB, 'utf8')) } catch (e) { return { balances: {}, unclaimed: {} } }
}
function writeDb(obj) { fs.writeFileSync(DB, JSON.stringify(obj, null, 2)) }

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { wallet, amount } = req.body || {}
  if (!wallet || typeof amount !== 'number') return res.status(400).json({ error: 'missing wallet or amount' })
  const db = readDb()
  const cur = db.balances[wallet] || 0
  if (cur < amount) return res.status(400).json({ ok: false, error: 'insufficient balance' })
  db.balances[wallet] = Math.max(0, cur - amount)
  writeDb(db)
  return res.status(200).json({ ok: true, balance: db.balances[wallet] })
}