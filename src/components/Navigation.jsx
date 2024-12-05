import { Link } from 'react-router-dom';

export default function Navigation() {
	return (
		<nav className="nav">
			<Link to="/" className="nav__link">
				Home
			</Link>
			<Link to="/archive" className="nav__link">
				Alle Episoden
			</Link>
			<Link to="/about" className="nav__link">
				Über den Podcast
			</Link>
			<a
				href="https://gearofthedark.bigcartel.com/"
				target="_blank"
				rel="noreferrer"
				className="nav__link"
			>
				Merch
			</a>
		</nav>
	);
}
