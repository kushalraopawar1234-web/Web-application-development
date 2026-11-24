import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MatchCard from './components/MatchCard'
import matches from './data/matches'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section id="matches" className="matches-section">
          <div className="section-head">
            <h2>Match Schedule</h2>
            <p>
              {matches.length} fixtures · every card is the same{' '}
              <code>MatchCard</code> component, rebuilt from different data
            </p>
          </div>

          {/* One component, mapped over the data array */}
          <div className="match-grid">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 IPL Ticket Booking · Built with React + Vite</p>
      </footer>
    </>
  )
}

export default App
