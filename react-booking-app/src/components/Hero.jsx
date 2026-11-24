function Hero() {
  return (
    <section id="home" className="hero">
      <p className="hero-eyebrow">IPL 2026 · Live at the stadium</p>
      <h1>Experience the stadium energy, live.</h1>
      <p className="hero-copy">
        Book your seat for the biggest fixtures of the season. Choose a match,
        pick your stand, and watch the total update as you go.
      </p>

      <div className="hero-actions">
        <a className="btn btn-primary" href="#matches">
          View Schedule
        </a>
        <a className="btn btn-ghost" href="#book-ticket">
          Book Ticket
        </a>
      </div>

      <dl className="hero-stats">
        <div>
          <dt>Matches</dt>
          <dd>74</dd>
        </div>
        <div>
          <dt>Venues</dt>
          <dd>12</dd>
        </div>
        <div>
          <dt>Teams</dt>
          <dd>10</dd>
        </div>
      </dl>
    </section>
  )
}

export default Hero
