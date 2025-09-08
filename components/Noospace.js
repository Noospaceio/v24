import React, { useEffect, useState, useMemo } from 'react'
// supabase client removed for security: using server API endpointsimport { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const DAILY_LIMIT = 3

// ---- Server-backed balance helpers ----
async function getBalance(wallet) {
  const r = await fetch('/api/balance?wallet=' + encodeURIComponent(wallet))
  return await r.json()
}
async function postAdjust(wallet, delta) {
  const r = await fetch('/api/balance', {
    method: 'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({ wallet, delta })
  })
  return await r.json()
}
async function sacrificeServer(wallet, amount) {
  const r = await fetch('/api/sacrifice', {
    method: 'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({ wallet, amount })
  })
  return await r.json()
}
async function harvestServer(wallet) {
  const r = await fetch('/api/harvest', {
    method: 'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({ wallet })
  })
  return await r.json()
}
// ---- end helpers ----

const MAX_CHARS = 240
const AIRDROP_PER_USER = 1600
const HARVEST_DAYS = 9

function formatDaysLeft(startTs) {
  const now = Date.now()
  const diff = Math.max(0, startTs + HARVEST_DAYS * 24 * 60 * 60 * 1000 - now)
  return Math.ceil(diff / (24 * 60 * 60 * 1000))
}

async function savePostToBackend(wallet, entry) {
  if (supabase && wallet) {
    try {
      // removed supabase call
const ok = confirm('Sacrifice 20 NOO to highlight this post? (mock)'); if (!ok) return; await addOrUpdateBalance(wallet, -20); setBalance(await fetchBalance(wallet)); const newEntries = entries.map(x=> x.id===e.id?{...x,highlighted:true}:x); setEntries(newEntries) }} className="burn">Sacrifice 20 NOO</button>
                  </div>
                  <time>{new Date(e.created_at).toLocaleString()}</time>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="noo-footer">
        <div>NooSpace — A mycelial protocol for the planetary mind.</div>
        <div>Seeds, ritual, and resonance • Harvest cycles every {HARVEST_DAYS} days</div>
      </footer>
    </div>
  )
}