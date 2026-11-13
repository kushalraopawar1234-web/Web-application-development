function VenueSection() {
  return (
    <section className="venue-strip" id="stadiums">
      <div className="venue-image" role="img" aria-label="Cricket stadium filled with fans" />
      <div className="venue-copy">
        <p className="eyebrow eyebrow--dark">THE HOME GROUND</p>
        <h2>More than a<br />place to play.</h2>
        <p>Every stadium has its own soundtrack. Find the ground, feel the noise, make the night yours.</p>
        <a href="#fixtures">Explore all venues <span aria-hidden="true">→</span></a>
      </div>
      <div className="venue-count"><strong>10</strong><span>ICONIC<br />GROUNDS</span></div>
    </section>
  )
}

export default VenueSection