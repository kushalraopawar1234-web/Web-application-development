# IPL Ticket Booking (React + Vite + Supabase)

A small IPL fixture list where every card reads its seats from Supabase Postgres,
writes real bookings to the database, and updates seat counts live over Realtime.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5174
```

`npm run dev` uses port **5174** on purpose so it can run next to the other app
in `WebApp/node/nodejs` (port 5173). Add `--port 5174 --strictPort` if you run
`vite` directly.

## Supabase setup

This app shares the `boundary-ipl` project with the Boundary app but uses its own
prefixed tables, so the two never collide:

| Table | Purpose |
| --- | --- |
| `ipl_matches` | fixtures, per-stand prices, `available_seats` |
| `ipl_bookings` | one row per confirmed booking |

1. Open the project → **SQL Editor → New query**.
2. Paste and run [`supabase/schema.sql`](./supabase/schema.sql). It creates both
   tables, seeds 3 fixtures, grants `anon` access, enables RLS demo policies, and
   adds both tables to the `supabase_realtime` publication.
3. Copy `.env.example` to `.env` and fill in the values from
   **Project Settings → API**:

   ```
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
   ```

4. Restart `npm run dev` (Vite only reads env vars at startup).

Without a `.env` the app still renders, but shows a "Connect your Supabase
project" notice instead of fixtures.

## How the booking works

`src/api.js`:

1. `fetchMatches()` → `ipl_matches.select(...)` ordered by `sort_order`.
2. `createBooking()` → inserts into `ipl_bookings`, then decrements
   `ipl_matches.available_seats` with a compare-and-swap
   (`update … eq(id) … eq('available_seats', previous)`), so two people can't
   oversell the last seats. If the swap loses the race, the booking row is
   deleted again and the card shows an error.
3. `subscribeToMatches()` → `postgres_changes` on `ipl_matches`, so a seat change
   made anywhere (another tab, the Table Editor, curl) repaints the card without
   a reload.

Cards are controlled by `src/components/MatchCard.jsx`; all fetching and booking
state lives in `src/App.jsx`.

## Verify it end to end

1. Load the app: three fixtures appear with `120 / 84 / 62 seats left`.
2. Pick a stand and ticket count, press **Book this match**.
3. The card shows `Booking IPL-XXXXXX saved to your database` and the seat pill
   drops by the number of tickets.
4. In Supabase → **Table Editor**, `ipl_bookings` has the new row and
   `ipl_matches.available_seats` is lower.
5. Change `available_seats` in the Table Editor while the page is open — the pill
   updates on its own.

## Notes

- The RLS policies are demo-grade: anyone with the publishable key can read
  bookings and decrement seats. Before shipping, move the seat decrement into a
  Postgres function (RPC) and scope booking reads to the signed-in user.
- To restore the demo seat counts, uncomment the reset query at the bottom of
  `supabase/schema.sql` and run it.
- If `npm run lint` prints "No files found to lint" (happens on OneDrive
  placeholder folders), run it with explicit paths:
  `npx oxlint src/App.jsx src/main.jsx src/api.js src/supabase.js "src/components/*.jsx"`.
