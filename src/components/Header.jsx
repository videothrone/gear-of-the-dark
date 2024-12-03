import { Link } from 'react-router-dom';

export default function Header() {
	return (
		<header className="site-header content-padding">
			<nav className="site-nav">
				<Link to="/">Home</Link>
				<Link to="/archive">Alle Episoden</Link>
				<Link to="/about">Über den Podcast</Link>
			</nav>
		</header>
	);
}
