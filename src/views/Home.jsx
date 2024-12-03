import CardList from '../components/CardList';
import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<section className="home">
			<CardList limit={9} />
			<Link to="/archive">Alle Episoden</Link>
		</section>
	);
}
