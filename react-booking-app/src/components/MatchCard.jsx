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

// Props: the whole match object is passed in from App.
// State: the stand choice and ticket count live inside this card only.
function MatchCard({ match }) {
  const [stand, setStand] = useState('general')
  const [quantity, setQuantity] = useState(1)
  const [booked, setBooked] = useState(false)

  const unitPrice = match.prices[stand]
  const total = unitPrice * quantity

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

      <div className="match-controls">
        <label>
          <span>Stand</span>
          <select
            value={stand}
            onChange={(event) => {
              setStand(event.target.value)
              setBooked(false)
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
            max="10"
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value)
              setQuantity(Number.isNaN(next) ? 1 : Math.min(10, Math.max(1, next)))
              setBooked(false)
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
          <dd>{quantity}</dd>
        </div>
        <div className="total-row">
          <dt>Total</dt>
          <dd>{rupee.format(total)}</dd>
        </div>
      </dl>

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => setBooked(true)}
      >
        {booked ? 'Booked ✓' : 'Book this match'}
      </button>
    </article>
  )
}

export default MatchCard
