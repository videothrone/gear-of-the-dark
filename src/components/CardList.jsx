import { useState } from 'react';
import { useRssFeed } from '../hooks/useFetchRSS.js';
import Card from './Card.jsx';

export default function CardList({
	limit,
	paginate = false,
	itemsPerPage = 9,
}) {
	const { feedItems, isLoading, error } = useRssFeed(
		'https://gearofthedark.podigee.io/feed/mp3'
	);
	const [currentPage, setCurrentPage] = useState(1);

	if (isLoading) {
		return <div aria-live="polite">Loading...</div>;
	}

	if (error) {
		return <div aria-live="assertive">Error: {error}</div>;
	}

	let displayedItems = feedItems;
	if (limit && !paginate) {
		displayedItems = feedItems.slice(0, limit);
	} else if (paginate) {
		const startIndex = (currentPage - 1) * itemsPerPage;
		displayedItems = feedItems.slice(startIndex, startIndex + itemsPerPage);
	}

	const totalPages = Math.ceil(feedItems.length / itemsPerPage);

	return (
		<section className="card-list" aria-labelledby="card-list-title">
			<h2 id="card-list-title" className="card-list__title">
				Gear of the dark
			</h2>
			<ul className="card-list__items">
				{displayedItems.map((item, index) => (
					<li key={index} className="card-list__item">
						<Card item={item} />
					</li>
				))}
			</ul>
			{paginate && (
				<div className="card-list__pagination">
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
					>
						Previous
					</button>
					<span>
						{currentPage} of {totalPages}
					</span>
					<button
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
						disabled={currentPage === totalPages}
					>
						Next
					</button>
				</div>
			)}
		</section>
	);
}
