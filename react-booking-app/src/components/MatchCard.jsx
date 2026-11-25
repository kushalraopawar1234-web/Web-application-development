import { useState } from 'react'

const STAND_LABELS = {
  general: 'General',
  premium: 'Premium',
  vip: 'VIP',
}

const rupee = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

// Props: the match row from Supabase plus a callback that writes the booking.
// State: stand choice, ticket count and the booking result stay local to the card.
function MatchCard({ match, onBook }) {
  const [stand, setStand] = useState('general')
  const [quantity, setQuantity] = useState(1)
  const [reference, setReference] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const seatsLeft = match.availableSeats
  const soldOut = seatsLeft <= 0
  const maxQuantity = Math.max(1, Math.min(10, seatsLeft))
  const effectiveQuantity = Math.min(quantity, maxQuantity)
  const unitPrice = match.prices[stand]
  const total = unitPrice * effectiveQuantity

  async function handleBook() {
    if (soldOut || saving) return

    setError('')
    setReference('')
    setSaving(true)

    try {
      const result = await onBook({
        match,
        stand,
        quantity: effectiveQuantity,
        totalPrice: total,
      })
      setReference(result.reference)
    } catch (err) {
      setError(err.message || 'Could not complete the booking.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="match-card">
      <header className="match-card-head">
        <span className="match-no">{match.matchNo}</span>
        <span className="venue-tag">{match.venue.split(',')[0]}</span>
      </header>

      <div className="teams">
        <div className="team">
          <span className="team-badge">{match.team1.short}</span>
          <span className="team-name">{match.team1.name}</span>
        </div>
        <span className="versus">vs</span>
        <div className="team">
          <span className="team-badge">{match.team2.short}</span>
          <span className="team-name">{match.team2.name}</span>
        </div>
      </div>

      <p className="match-meta">
        {match.date} · {match.time} · {match.venue}
      </p>

      <div className="availability-row">
        <span className={`seats-pill${soldOut ? ' seats-pill--out' : ''}`}>
          {soldOut ? 'Sold out' : `${seatsLeft} seats left`}
        </span>
        <span className="live-pill">LIVE · SUPABASE</span>
      </div>

      <div className="match-controls">
        <label>
          <span>Stand</span>
          <select
            value={stand}
            onChange={(event) => {
              setStand(event.target.value)
              setReference('')
              setError('')
            }}
          >
            {Object.keys(match.prices).map((key) => (
              <option key={key} value={key}>
                {STAND_LABELS[key]} — {rupee.format(match.prices[key])}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Tickets</span>
          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={effectiveQuantity}
            disabled={soldOut}
            onChange={(event) => {
              const next = Number(event.target.value)
              setQuantity(Number.isNaN(next) ? 1 : Math.min(maxQuantity, Math.max(1, next)))
              setReference('')
              setError('')
            }}
          />
        </label>
      </div>

      <dl className="match-summary">
        <div>
          <dt>Stand</dt>
          <dd>{STAND_LABELS[stand]}</dd>
        </div>
        <div>
          <dt>Unit price</dt>
          <dd>{rupee.format(unitPrice)}</dd>
        </div>
        <div>
          <dt>Tickets</dt>
          <dd>{effectiveQuantity}</dd>
        </div>
        <div className="total-row">
          <dt>Total</dt>
          <dd>{rupee.format(total)}</dd>
        </div>
      </dl>

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleBook}
        disabled={soldOut || saving}
      >
        {soldOut ? 'Sold out' : saving ? 'Saving to database…' : reference ? 'Booked ✓' : 'Book this match'}
      </button>

      {reference && (
        <p className="booking-ref">Booking {reference} saved to your database.</p>
      )}
      {error && <p className="card-error" role="alert">{error}</p>}
    </article>
  )
}

export default MatchCard
