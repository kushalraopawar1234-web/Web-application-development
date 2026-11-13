import { useState } from 'react'
import MatchCard from './MatchCard.jsx'
import { matches } from '../data/ipl.js'

function MatchList({ selectedMatchId, onSelectMatch }) {
  const [cityFilter, setCityFilter] = useState('All cities')
  const [search, setSearch] = useState('')
  const cities = ['All cities', ...new Set(matches.map((match) => match.city))]
  const query = search.trim().toLowerCase()
  const visibleMatches = matches.filter((match) => {
    const matchesCity = cityFilter === 'All cities' || match.city === cityFilter
    const matchesSearch = !query || [match.homeName, match.awayName, match.city, match.venue]
      .some((value) => value.toLowerCase().includes(query))
    return matchesCity && matchesSearch
  })

  return (
    <div className="fixtures-column">
      <div className="fixture-toolbar">
        <div className="city-filters" aria-label="Filter by city">
          {cities.map((city) => (
            <button
              className={`filter-button${cityFilter === city ? ' filter-button--active' : ''}`}
              key={city}
              onClick={() => setCityFilter(city)}
              aria-pressed={cityFilter === city}
            >{city}</button>
          ))}
        </div>
        <label className="search-box">
          <span className="sr-only">Search teams, cities or stadiums</span>
          <span className="search-icon" aria-hidden="true" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search matches" />
        </label>
      </div>
      <div className="match-list" aria-live="polite">
        {visibleMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            selected={selectedMatchId === match.id}
            onSelect={onSelectMatch}
          />
        ))}
        {visibleMatches.length === 0 && <p className="empty-results">No matches found. Try another city or search.</p>}
      </div>
      <div className="fixture-footnote"><span className="footnote-line" /> Showing {visibleMatches.length} of {matches.length} fixtures <span>All times in IST</span></div>
    </div>
  )
}

export default MatchList