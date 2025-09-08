import React, { useEffect, useState } from 'react'
// supabase client removed for security
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const DAILY_LIMIT = 3
const MAX_CHARS = 240
const AIRDROP_PER_USER = 1600
const HARVEST_DAYS = 9

// ---- Server-backed balance helpers ----
async function getBalance(wallet) {
  const r = await fetch('/api/balance?wallet=' + encodeURIComponent(wallet))
  return await r.json()
}

async function postAdjust(wallet, delta) {
  const r = await fetch('/api/balance', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ wallet, delta }),
  })
  return await r.json()
}

async function sacrificeServer(wallet, amount) {
  const r = await fetch('/api/sacrifice', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ wallet, amount }),
  })
  return await r.json()
}

async function harvestServer(wallet) {
  const r = await fetch('/api/harvest', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ wallet }),
  })
  return await r.json()
}
// ---- end helpers ----

function formatDaysLeft(startTs) {
  const now = Date.now()
  const diff = Math.max(0, startTs + HARVEST_DAYS * 24 * 60 * 60 * 1000 - now)
  return Math.ceil(diff / (24 * 60 * 60 * 1000))
}

export default function Noospace() {
  const { connection } = useConnection()
  const { publicKey: wallet } = useWallet()
  const [balance, setBalance] = useState(0)
  const [entries, setEntries] = useState([])

  useEffect(() => {
    if (wallet) {
      getBalance(wallet).then((b) => setBalance(b))
    }
  }, [wallet])

  // Handler for the "Sacrifice 20 NOO" button
  const handleSacrifice = async (entryId) => {
    if (!wallet) return
    const ok = confirm('Sacrifice 20 NOO to highlight this post? (mock)')
    if (!ok) return

    // Perform server call
    await postAdjust(wallet, -20)
    const newBalance = await getBalance(wallet)
    setBalance(newBalance)

    // Update entries locally
    const newEntries = entries.map((x) =>
      x.id === entryId ? { ...x, highlighted: true } : x
    )
    setEntries(newEntries)
  }

  return (
    <div className="noospace">
      <main>
        <section>
          <div className="entries">
            {entries.map((e) => (
              <div key={e.id} className={`entry ${e.highlighted ? 'highlighted' : ''}`}>
                <div>{e.content}</div>
                <div className="actions">
                  <button
                    className="burn"
                    onClick={() => handleSacrifice(e.id)}
                  >
                    Sacrifice 20 NOO
                  </button>
                  <time>{new Date(e.created_at).toLocaleString()}</time>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="noo-footer">
        <div>NooSpace — A mycelial protocol for the planetary mind.</div>
        <div>
          Seeds, ritual, and resonance • Harvest cycles every {HARVEST_DAYS} days
        </div>
      </footer>
    </div>
  )
}
