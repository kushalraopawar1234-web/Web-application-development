import { useState } from 'react'
import BookingForm from './components/Bookingform.jsx'
import BookingModal from './components/BookingModal.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import MatchList from './components/MatchList.jsx'
import Navbar from './components/Navbar.jsx'
import VenueSection from './components/VenueSection.jsx'
import { matches, ticketTypes } from './data/ipl.js'
import './App.css'

function App() {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0].id)
  const [selectedTicketId, setSelectedTicketId] = useState(ticketTypes[0].id)
  const [quantity, setQuantity] = useState(2)
  const [modal, setModal] = useState('')
  const [bookings, setBookings] = useState([])
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  const selectedMatch = matches.find((match) => match.id === selectedMatchId)
  const selectedTicket = ticketTypes.find((ticket) => ticket.id === selectedTicketId)
  const totalPrice = (selectedMatch.startingPrice + selectedTicket.extra) * quantity

  function confirmBooking({ guestName, guestEmail }) {
    const booking = {
      reference: `IPT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      match: selectedMatch,
      ticket: selectedTicket.name,
      quantity,
      total: totalPrice,
    }

    setBookings((current) => [booking, ...current])
    setConfirmedBooking(booking)
    setModal('confirmed')
  }

  return (
    <div className="site-shell">
      <Navbar onOpenBookings={() => setModal('bookings')} />
      <main id="top">
        <Hero onSelectMatch={() => setSelectedMatchId('csk-mi')} />
        <section className="ticker" aria-label="Booking information">
          <span className="ticker-item"><span className="ticker-star">✳</span> YOUR CITY. YOUR TEAM. YOUR NIGHT.</span>
          <span className="ticker-divider" />
          <span className="ticker-item">FIVE MATCHES ON SALE <span className="ticker-arrow">↗</span></span>
          <span className="ticker-divider" />
          <span className="ticker-item ticker-muted">SAMPLE FIXTURES · DEMO CHECKOUT</span>
        </section>
        <section className="booking-section" id="fixtures">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--dark">THE NEXT BIG THING</p>
              <h2>Pick your match<span className="heading-period">.</span></h2>
            </div>
            <p className="section-side-note">Five fixtures. One unforgettable night.<br />Choose a game and find your seat.</p>
          </div>
          <div className="booking-grid">
            <MatchList selectedMatchId={selectedMatchId} onSelectMatch={setSelectedMatchId} />
            <BookingForm
              match={selectedMatch}
              selectedTicketId={selectedTicketId}
              onSelectTicket={setSelectedTicketId}
              quantity={quantity}
              onQuantityChange={setQuantity}
              totalPrice={totalPrice}
              onCheckout={() => setModal('checkout')}
            />
          </div>
        </section>
        <VenueSection />
      </main>
      <Footer />
      {modal && (
        <BookingModal
          type={modal}
          match={selectedMatch}
          ticket={selectedTicket}
          quantity={quantity}
          totalPrice={totalPrice}
          bookings={bookings}
          confirmedBooking={confirmedBooking}
          onClose={() => setModal('')}
          onConfirm={confirmBooking}
          onBrowseMatches={() => {
            setModal('')
            document.getElementById('fixtures')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      )}
    </div>
  )
}

export default App