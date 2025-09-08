import React, { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const DAILY_LIMIT = 3
const MAX_CHARS = 240
const AIRDROP_PER_USER = 1600
const HARVEST_DAYS = 9

// ---- Server-backed helpers ----
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

async function harvestServer(wallet) {
  const r = await fetch('/api/harvest', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ wallet }),
  })
  return await r.json()
}

async function fetchEntries(wallet) {
  const r = await fetch('/api/entries?wallet=' + encodeURIComponent(wallet))
  return await r.json()
}

// For demo: track daily airdrop claims
async function fetchDailyClaims(wallet) {
  const r = await fetch('/api/daily-claims?wallet=' + encodeURIComponent(wallet))
  return await r.json()
}
// ---- end helpers ----

export default function Noospace() {
  const { publicKey: wallet } = useWallet()
  const [balance, setBalance] = useState(0)
  const [entries, setEntries] = useState([])
  const [dailyClaims, setDailyClaims] = useState(0)

  // Load balance
  useEffect(() => {
    if (wallet) getBalance(wallet).then(setBalance)
  }, [wallet])

  // Load entries
  useEffect(() => {
    if (wallet) fetchEntries(wallet).then(setEntries)
  }, [wallet])

  // Load daily claims
  useEffect(() => {
    if (wallet) fetchDailyClaims(wallet).then(setDailyClaims)
  }, [wallet])

  // Harvest button
  const handleHarvest = async () => {
    if (!wallet) return
    await harvestServer(wallet)
    const newBalance = await getBalance(wallet)
    setBalance(newBalance)
    alert('Harvest claimed!')
  }

  // Sacrifice button
  const handleSacrifice = async (entryId) => {
    if (!wallet) return
    const ok = confirm('Sacrifice 20 NOO to highlight this post?')
    if (!ok) return

    await postAdjust(wallet, -20)
    const newBalance = await getBalance(wallet)
    setBalance(newBalance)

    const newEntries = entries.map((x) =>
      x.id === entryId ? { ...x, highlighted: true } : x
    )
    setEntries(newEntries)
  }

  // Claim daily seeds
  const handleClaimSeeds = async () => {
    if (!wallet) return
    if (dailyClaims >= DAILY_LIMIT) {
      alert('Daily limit reached!')
      return
    }

    await postAdjust(wallet, AIRDROP_PER_USER)
    const newBalance = await getBalance(wallet)
    setBalance(newBalance)
    setDailyClaims(dailyClaims + 1)
    alert(`Claimed ${AIRDROP_PER_USER} seeds!`)
  }

  return (
    <div className="noospace">
      <header>
        <WalletMultiButton />
        <div>Balance: {balance} NOO</div>
        <div>
          Daily Seeds: {dailyClaims}/{DAILY_LIMIT}{' '}
          <button onClick={handleClaimSeeds} disabled={dailyClaims >= DAILY_LIMIT}>
            Claim Seeds
          </button>
        </div>
      </header>

      <main>
        <section>
          <h2>Entries</h2>
          {entries.length === 0 && <div>No posts yet</div>}
          {entries.map((e) => (
            <div key={e.id} className={`entry ${e.highlighted ? 'highlighted' : ''}`}>
              <div>{e.content}</div>
              <div className="actions">
                <button className="burn" onClick={() => handleSacrifice(e.id)}>
                  Sacrifice 20 NOO
                </button>
                <time>{new Date(e.created_at).toLocaleString()}</time>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2>Harvest</h2>
          <button onClick={handleHarvest}>Claim Harvest</button>
        </section>
      </main>

      <footer>
        <div>NooSpace — A mycelial protocol for the planetary mind.</div>
        <div>Seeds, ritual, and resonance • Harvest cycles every {HARVEST_DAYS} days</div>
      </footer>
    </div>
  )
}
