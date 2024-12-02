import CardList from '../components/CardList';

export default function Home() {
	return (
		<section className="home">
			<CardList limit={9} />
		</section>
	);
}
