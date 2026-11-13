function Navbar({ onOpenBookings }) {
	return (
		<header className="topbar">
			<a className="brand" href="#top" aria-label="Boundary home">
				<span className="brand-ball" aria-hidden="true"><span /></span>
				<span className="brand-name">BOUNDARY<span className="brand-period">.</span></span>
			</a>
			<nav className="main-nav" aria-label="Main navigation">
				<a className="nav-link nav-link--active" href="#fixtures">Matches</a>
				<a className="nav-link" href="#stadiums">Stadiums</a>
				<button className="nav-link nav-bookings" onClick={onOpenBookings}>My bookings</button>
			</nav>
			<a className="topbar-cta" href="#fixtures">Find tickets <span aria-hidden="true">↗</span></a>
		</header>
	)
}

export default Navbar
