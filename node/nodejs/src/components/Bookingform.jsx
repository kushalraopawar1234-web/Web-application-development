import TeamMark from './TeamMark.jsx'
import { formatPrice, ticketTypes } from '../data/ipl.js'

function BookingForm({ match, selectedTicketId, onSelectTicket, quantity, onQuantityChange, totalPrice, onCheckout }) {
	return (
		<aside className="seat-panel" aria-labelledby="seat-panel-title">
			<div className="panel-topline"><span>YOUR MATCHDAY</span><span className="panel-index">01 — 03</span></div>
			<h3 id="seat-panel-title">Find your<br /><span>seat.</span></h3>
			<div className="selected-game">
				<div className="selected-game-date"><span>{match.day}</span><strong>{match.date}</strong></div>
				<div className="selected-game-teams"><TeamMark team={match.home} /><TeamMark team={match.away} /></div>
				<div className="selected-game-info"><strong>{match.home} <span>vs</span> {match.away}</strong><span>{match.city} · {match.time}</span></div>
			</div>
			<div className="seat-divider" />
			<div className="seat-heading"><span>CHOOSE YOUR VIEW</span><span>PRICE / SEAT</span></div>
			<div className="ticket-options">
				{ticketTypes.map((ticket, index) => {
					const price = match.startingPrice + ticket.extra
					const selected = selectedTicketId === ticket.id

					return (
						<button
							className={`ticket-option${selected ? ' ticket-option--selected' : ''}`}
							key={ticket.id}
							onClick={() => onSelectTicket(ticket.id)}
							aria-pressed={selected}
						>
							<span className="radio-mark" aria-hidden="true" />
							<span className="ticket-copy"><strong>{ticket.name}</strong><small>{ticket.note}</small></span>
							<span className="ticket-price">{formatPrice(price)}<small> / seat</small></span>
							<span className="ticket-tier">0{index + 1}</span>
						</button>
					)
				})}
			</div>
			<div className="quantity-row">
				<div><strong>Tickets</strong><span>Up to 8 per booking</span></div>
				<div className="stepper" aria-label="Ticket quantity">
					<button onClick={() => onQuantityChange((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Remove one ticket">−</button>
					<span aria-live="polite">{quantity}</span>
					<button onClick={() => onQuantityChange((value) => Math.min(8, value + 1))} disabled={quantity >= 8} aria-label="Add one ticket">+</button>
				</div>
			</div>
			<div className="total-row"><span>Total <small>incl. taxes</small></span><strong>{formatPrice(totalPrice)}</strong></div>
			<button className="checkout-button" onClick={onCheckout}>Continue to checkout <span aria-hidden="true">↗</span></button>
			<p className="checkout-note"><span className="lock-mark" aria-hidden="true">◇</span> Demo booking · no payment collected</p>
		</aside>
	)
}

export default BookingForm
