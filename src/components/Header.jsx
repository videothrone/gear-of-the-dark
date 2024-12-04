import { Link } from 'react-router-dom';

export default function Header() {
	return (
		<header className="site-header content-padding">
			<nav className="site-nav">
				<Link to="/">Home</Link>
				<Link to="/archive">Alle Episoden</Link>
				<Link to="/about">Über den Podcast</Link>
				<a
					href="https://gearofthedark.bigcartel.com/"
					target="_blank"
					rel="noreferrer"
				>
					Merch
				</a>
			</nav>
			<img
				src="/img/gotd-logo1_w.webp"
				alt="Gear of the Dark - Der Podcast"
				className="site-logo"
			/>
		</header>
	);
}
