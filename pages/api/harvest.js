// Harvest endpoint: simulates on-chain transfer and resets server-side balance to 0.
// In production replace the simulated signature with actual on-chain transaction logic.
import fs from 'fs'
import path from 'path'

const DB = path.join(process.cwd(), 'data', 'db.json')
function readDb() { try { return JSON.parse(fs.readFileSync(DB,'utf8')) } catch(e){ return { balances: {}, unclaimed:{} } } }
function writeDb(obj) { fs.writeFileSync(DB, JSON.stringify(obj, null, 2)) }

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { wallet } = req.body || {}
  if (!wallet) return res.status(400).json({ error: 'missing wallet' })
  const db = readDb()
  const amount = db.balances[wallet] || 0
  if (amount <= 0) return res.status(400).json({ ok:false, error: 'no balance to harvest' })
  // Simulate sending on-chain: generate pseudo signature
  const ts = Date.now()
  const sig = 'SIMULATED_TX_' + wallet.slice(0,6) + '_' + ts
  // reset balance
  db.balances[wallet] = 0
  writeDb(db)
  return res.status(200).json({ ok: true, awarded: amount, txSignature: sig })
}