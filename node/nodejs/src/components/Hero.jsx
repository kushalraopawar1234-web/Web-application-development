import TeamMark from './TeamMark.jsx'

function Hero({ onSelectMatch }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        className="hero-photo"
        src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1900&q=85"
        alt="A cricket ground ready for a night match"
      />
      <div className="hero-content">
        <p className="eyebrow"><span className="live-dot" /> THE IPL, LIVE AND LOUD</p>
        <h1 id="hero-title">Make room<br />for <span>match day.</span></h1>
        <p className="hero-intro">Big rivalries. Bigger nights. Your seat is waiting.</p>
        <a className="hero-button" href="#fixtures">Explore fixtures <span aria-hidden="true">↓</span></a>
      </div>
      <div className="hero-match" aria-label="Featured match">
        <div className="hero-match-top"><span>UP NEXT</span><span className="hero-match-number">MATCH 26</span></div>
        <div className="hero-teams">
          <div className="hero-team"><TeamMark team="CSK" /><span>Chennai</span></div>
          <span className="hero-vs">VS</span>
          <div className="hero-team"><TeamMark team="MI" /><span>Mumbai</span></div>
        </div>
        <div className="hero-match-bottom">
          <span>FRI, 18 APR · 7:30 PM</span>
          <a href="#fixtures" onClick={onSelectMatch}>Tickets <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="hero-side-note">THE CROWD IS YOURS <span>01 / 05</span></div>
    </section>
  )
}

export default Hero