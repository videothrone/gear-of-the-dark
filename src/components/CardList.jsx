import { useState, useMemo, useEffect } from 'react';
import { useRssFeed } from '../hooks/useFetchRSS.js';
import Card from './Card.jsx';
import AudioPlayer from './AudioPlayer.jsx';
import Pagination from './Pagination.jsx';
import Loader from './Loader.jsx';

export default function CardList({
	limit,
	paginate = false,
	itemsPerPage = 9,
	searchTerm = '',
	sortOrder = 'newest',
	onSearchResults = () => {},
}) {
	const { feedItems, isLoading, error } = useRssFeed(
		'https://gearofthedark.podigee.io/feed/mp3'
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [activeEpisode, setActiveEpisode] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const handlePlay = (item) => {
		setActiveEpisode(item);
		setIsPlaying(true);
	};

	const handlePause = () => {
		setIsPlaying(false);
	};

	const handleResume = () => {
		setIsPlaying(true);
	};

	const filteredAndSortedItems = useMemo(() => {
		let items = [...feedItems];

		if (searchTerm) {
			items = items.filter(
				(item) =>
					item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		items.sort((a, b) => {
			const dateA = new Date(a.pubDate);
			const dateB = new Date(b.pubDate);
			return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
		});

		return items;
	}, [feedItems, searchTerm, sortOrder]);

	useEffect(() => {
		const hasResults = filteredAndSortedItems.length > 0;
		if (onSearchResults) {
			onSearchResults(hasResults);
		}
	}, [filteredAndSortedItems, onSearchResults]);

	const displayedItems = useMemo(() => {
		if (limit && !paginate) {
			return filteredAndSortedItems.slice(0, limit);
		} else if (paginate) {
			const startIndex = (currentPage - 1) * itemsPerPage;
			return filteredAndSortedItems.slice(
				startIndex,
				startIndex + itemsPerPage
			);
		}
		return filteredAndSortedItems;
	}, [filteredAndSortedItems, limit, paginate, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	if (isLoading) {
		return (
			<div aria-live="polite">
				<Loader />
			</div>
		);
	}

	if (error) {
		return <div aria-live="assertive">Error: {error}</div>;
	}

	return (
		<section className="card-list">
			<ul className="card-list__items">
				{displayedItems.map((item, index) => (
					<li key={index} className="card-list__item">
						<Card
							item={item}
							onPlay={() => handlePlay(item)}
							isActive={activeEpisode && activeEpisode.guid === item.guid}
							isPlaying={
								isPlaying && activeEpisode && activeEpisode.guid === item.guid
							}
						/>
					</li>
				))}
			</ul>
			{activeEpisode && (
				<AudioPlayer
					episode={activeEpisode}
					onClose={() => setActiveEpisode(null)}
					autoPlay={true}
					isPlaying={isPlaying}
					onPause={handlePause}
					onPlay={handleResume}
				/>
			)}
			{paginate && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</section>
	);
}
