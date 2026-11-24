function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="#home">
        <span className="brand-mark">IPL</span>
        <span className="brand-text">
          Ticket Booking
          <small>2026 Season</small>
        </span>
      </a>

      <nav aria-label="Main navigation">
        <ul>
          <li>
            <a href="#matches">Matches</a>
          </li>
          <li>
            <a href="#book-ticket">Book Ticket</a>
          </li>
          <li>
            <a href="#my-bookings">My Bookings</a>
          </li>
          <li>
            <a href="#guidelines">Guidelines</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
