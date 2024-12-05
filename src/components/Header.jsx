import Navigation from './Navigation';

export default function Header() {
	return (
		<header className="site-header content-padding">
			<Navigation />
			<img
				src="/img/gotd-logo1_w.webp"
				alt="Gear of the Dark - Der Podcast"
				className="site-logo"
			/>
		</header>
	);
}
