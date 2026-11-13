import TeamMark from './TeamMark.jsx'
import { formatPrice } from '../data/ipl.js'

function MatchCard({ match, selected, onSelect }) {
	const [day, month] = match.date.split(' ')

	return (
		<article className={`match-card${selected ? ' match-card--selected' : ''}`}>
			<div className="match-date"><span>{match.day}</span><strong>{day}</strong><span>{month}</span></div>
			<div className="match-card-main">
				<div className="match-meta">
					<span>{match.matchNo}</span><span className="meta-divider">·</span><span>{match.time}</span>
					<span className="availability"><span />{match.status}</span>
				</div>
				<div className="match-teams">
					<div className="match-team"><TeamMark team={match.home} /><span>{match.homeName}</span></div>
					<span className="match-vs">VS</span>
					<div className="match-team"><TeamMark team={match.away} /><span>{match.awayName}</span></div>
				</div>
				<p className="match-venue"><span className="pin-dot" aria-hidden="true" />{match.venue} <span>· {match.city}</span></p>
			</div>
			<div className="match-card-action">
				<span>From <strong>{formatPrice(match.startingPrice)}</strong></span>
				<button
					className={`select-match${selected ? ' select-match--active' : ''}`}
					onClick={() => onSelect(match.id)}
					aria-label={`Select ${match.home} versus ${match.away} in ${match.city}`}
				>{selected ? 'Selected' : 'Select'} <span aria-hidden="true">→</span></button>
			</div>
		</article>
	)
}

export default MatchCard
