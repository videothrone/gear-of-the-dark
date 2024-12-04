import { useState, useEffect } from 'react';
import CardList from '../components/CardList';
import FilterControls from '../components/FilterControls';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export default function Archive() {
	const [searchInput, setSearchInput] = useState('');
	const [sortOrder, setSortOrder] = useState('newest');
	const debouncedSearchTerm = useDebouncedValue(searchInput, 300);
	const [effectiveSearchTerm, setEffectiveSearchTerm] = useState('');
	const [noResults, setNoResults] = useState(false);

	useEffect(() => {
		if (debouncedSearchTerm.length >= 2) {
			setEffectiveSearchTerm(debouncedSearchTerm);
		} else {
			setEffectiveSearchTerm('');
		}
	}, [debouncedSearchTerm]);

	const handleSearch = (event) => {
		setSearchInput(event.target.value);
	};

	const handleSortChange = (event) => {
		setSortOrder(event.target.value);
	};

	const handleSearchResults = (hasResults) => {
		setNoResults(!hasResults);
	};

	return (
		<section className="archive" aria-labelledby="archive__title">
			<h1 className="archive__title">Podcast Archiv</h1>
			<FilterControls
				searchValue={searchInput}
				onSearchChange={handleSearch}
				sortValue={sortOrder}
				onSortChange={handleSortChange}
				className="archive__controls"
			/>
			{noResults && effectiveSearchTerm && (
				<p className="archive__no-results">
					Keine Ergebnisse gefunden für &quot;{effectiveSearchTerm}&quot;.
				</p>
			)}

			<CardList
				paginate={true}
				itemsPerPage={9}
				searchTerm={effectiveSearchTerm}
				sortOrder={sortOrder}
				onSearchResults={handleSearchResults}
			/>
		</section>
	);
}
