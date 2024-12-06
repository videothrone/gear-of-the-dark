import CardList from '../components/CardList';
import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<section className="home" aria-labelledby="home__title">
			<h1 className="home__title h3">Neueste Episoden</h1>
			<CardList limit={9} />
			<Link to="/archive" className="home__link">
				Alle Episoden
			</Link>
		</section>
	);
}
