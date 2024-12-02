import { useState } from 'react';
import CardList from '../components/CardList';

export default function Archive() {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState('newest');

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSortChange = (event) => {
		setSortOrder(event.target.value);
	};

	return (
		<section className="archive">
			<h1 className="archive__title">Podcast Archiv</h1>
			<p className="archive__description">Durchstöbert alle unsere Episoden.</p>

			<div className="archive__controls">
				<input
					type="text"
					placeholder="Search podcasts..."
					value={searchTerm}
					onChange={handleSearch}
					className="archive__search"
				/>

				<select
					value={sortOrder}
					onChange={handleSortChange}
					className="archive__sort"
				>
					<option value="newest">Neuste zuerst</option>
					<option value="oldest">Älteste zuerst</option>
				</select>
			</div>

			<CardList
				paginate={true}
				itemsPerPage={9}
				searchTerm={searchTerm}
				sortOrder={sortOrder}
			/>
		</section>
	);
}
