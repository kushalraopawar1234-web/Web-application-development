import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MatchCard from './components/MatchCard'
import { createBooking, fetchMatches, mapMatch, subscribeToMatches } from './api.js'
import { isSupabaseConfigured } from './supabase.js'
import './App.css'

function App() {
  const [matches, setMatches] = useState([])
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'unconfigured')
  const [error, setError] = useState('')

  function loadMatches() {
    setStatus('loading')
    setError('')

    fetchMatches()
      .then((rows) => {
        setMatches(rows)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  // Initial load: fixtures come from Postgres, not the hardcoded array.
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let cancelled = false

    fetchMatches()
      .then((rows) => {
        if (cancelled) return
        setMatches(rows)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Realtime: seat counts follow the database across every open tab.
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    return subscribeToMatches((payload) => {
      if (payload.eventType === 'DELETE') {
        setMatches((current) => current.filter((match) => match.id !== payload.old?.id))
        return
      }

      const next = mapMatch(payload.new)
      setMatches((current) => {
        const exists = current.some((match) => match.id === next.id)
        const updated = exists
          ? current.map((match) => (match.id === next.id ? next : match))
          : [...current, next]
        return updated.sort((a, b) => a.sortOrder - b.sortOrder)
      })
    })
  }, [])

  async function bookTickets({ match, stand, quantity, totalPrice }) {
    const result = await createBooking({ match, stand, quantity, totalPrice })

    setMatches((current) =>
      current.map((item) =>
        item.id === match.id ? { ...item, availableSeats: result.availableSeats } : item,
      ),
    )

    return result
  }

  const summary = {
    loading: 'Loading fixtures from Supabase…',
    ready: `${matches.length} fixtures · live from Supabase`,
    error: 'Could not load fixtures',
    unconfigured: 'Connect Supabase to load fixtures',
  }[status]

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section id="matches" className="matches-section">
          <div className="section-head">
            <h2>Match Schedule</h2>
            <p>{summary}</p>
          </div>

          {status === 'unconfigured' && (
            <div className="notice">
              <strong>Connect your Supabase project</strong>
              <ol>
                <li>Run <code>supabase/schema.sql</code> in the Supabase SQL Editor.</li>
                <li>Copy <code>.env.example</code> to <code>.env</code> and paste your Project URL + Publishable key.</li>
                <li>Restart <code>npm run dev</code>.</li>
              </ol>
            </div>
          )}

          {status === 'loading' && <div className="notice">Loading matches from Supabase…</div>}

          {status === 'error' && (
            <div className="notice notice--error" role="alert">
              <strong>Could not load matches.</strong>
              <span>{error}</span>
              <button className="btn btn-ghost" type="button" onClick={loadMatches}>Try again</button>
            </div>
          )}

          {status === 'ready' && matches.length === 0 && (
            <div className="notice">
              No matches in the database yet. Run <code>supabase/schema.sql</code> in the Supabase SQL Editor.
            </div>
          )}

          {status === 'ready' && matches.length > 0 && (
            <div className="match-grid">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} onBook={bookTickets} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 IPL Ticket Booking · Built with React + Vite + Supabase</p>
      </footer>
    </>
  )
}

export default App
