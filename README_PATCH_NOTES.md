
PATCH NOTES - v19 -> v19_patched
- Removed direct supabase client usage in UI; added server API endpoints backed by data/db.json
  (pages/api/balance.js, sacrifice.js, harvest.js). This prevents exposing keys in the browser.
- Implemented server-side checks to prevent balances going negative on sacrifice.
- Implemented harvest endpoint that simulates on-chain transfer and resets backend balance to 0.
- Added helper client functions in components/Noospace.js to call the server endpoints.
- Added data/db.json as a simple JSON DB for balances/unclaimed (demo only). For production,
  replace with a proper DB (Postgres) or Supabase and implement secure on-chain transfers.
- Added .env.example and removed any hardcoded keys from code. Ensure you set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
  in environment if you want supabase-enabled features; otherwise server APIs will be used.
