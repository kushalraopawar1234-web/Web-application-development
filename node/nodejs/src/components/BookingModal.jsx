import { useState } from 'react'
import { formatPrice } from '../data/ipl.js'

function BookingModal({ type, match, ticket, quantity, totalPrice, bookings, confirmedBooking, onClose, onConfirm, onBrowseMatches }) {
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onConfirm({ guestName, guestEmail })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
        {type === 'checkout' && (
          <>
            <p className="eyebrow eyebrow--dark">ALMOST MATCHDAY</p>
            <h2 id="modal-title">Your seats,<br />locked in.</h2>
            <div className="modal-summary">
              <div><strong>{match.home} <span>vs</span> {match.away}</strong><span>{match.date} · {match.venue}</span></div>
              <div><strong>{quantity} × {ticket.name}</strong><span>{formatPrice(totalPrice)} total</span></div>
            </div>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <label>Your name<input required autoComplete="name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="As it appears on your ID" /></label>
              <label>Email address<input required type="email" autoComplete="email" value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} placeholder="you@example.com" /></label>
              <button className="checkout-button" type="submit">Confirm demo booking <span aria-hidden="true">↗</span></button>
            </form>
            <p className="modal-disclaimer">Demo only. No payment is taken and no real ticket is issued.</p>
          </>
        )}
        {type === 'confirmed' && confirmedBooking && (
          <div className="confirmation-view">
            <span className="confirmation-mark" aria-hidden="true">✓</span>
            <p className="eyebrow eyebrow--dark">YOU'RE ON THE LIST</p>
            <h2 id="modal-title">It's a<br />match.</h2>
            <p className="confirmation-greeting">Booking noted for {confirmedBooking.guestName}.</p>
            <div className="reference-block"><span>BOOKING REFERENCE</span><strong>{confirmedBooking.reference}</strong></div>
            <div className="modal-summary">
              <div><strong>{confirmedBooking.match.home} vs {confirmedBooking.match.away}</strong><span>{confirmedBooking.match.date} · {confirmedBooking.match.city}</span></div>
              <div><strong>{confirmedBooking.quantity} × {confirmedBooking.ticket}</strong><span>{formatPrice(confirmedBooking.total)}</span></div>
            </div>
            <button className="checkout-button" onClick={onClose}>Back to fixtures <span aria-hidden="true">→</span></button>
          </div>
        )}
        {type === 'bookings' && (
          <>
            <p className="eyebrow eyebrow--dark">YOUR MATCHDAY PLANS</p>
            <h2 id="modal-title">My bookings<span className="heading-period">.</span></h2>
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <span aria-hidden="true">✳</span>
                <p>No bookings yet.</p>
                <small>Pick a match and your demo bookings will show up here.</small>
                <button className="text-action" onClick={onBrowseMatches}>Browse matches <span aria-hidden="true">→</span></button>
              </div>
            ) : (
              <div className="saved-bookings">
                {bookings.map((booking) => (
                  <article className="saved-booking" key={booking.reference}>
                    <span className="saved-date">{booking.match.date}</span>
                    <div><strong>{booking.match.home} vs {booking.match.away}</strong><span>{booking.match.city} · {booking.quantity} × {booking.ticket}</span><small>{booking.reference}</small></div>
                    <b>{formatPrice(booking.total)}</b>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default BookingModal