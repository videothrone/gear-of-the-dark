import { FaSearch } from 'react-icons/fa';

export default function FilterControls({
	searchValue,
	onSearchChange,
	sortValue,
	onSortChange,
	className = '',
}) {
	return (
		<div className={`filter-controls ${className}`.trim()}>
			<div className="filter-controls__search-wrapper">
				<label
					htmlFor="search"
					className="filter-controls__search-label sr-only"
				>
					Episoden durchsuchen
				</label>
				<FaSearch className="filter-controls__search-icon" aria-hidden="true" />
				<input
					type="search"
					id="search"
					placeholder="Episoden durchsuchen..."
					value={searchValue}
					onChange={onSearchChange}
					className="filter-controls__search"
				/>
			</div>

			<div className="filter-controls__sort-wrapper">
				<label htmlFor="sort" className="filter-controls__sort-label">
					Sortierung
				</label>
				<select
					id="sort"
					value={sortValue}
					onChange={onSortChange}
					className="filter-controls__sort"
				>
					<option value="newest">Neuste zuerst</option>
					<option value="oldest">Älteste zuerst</option>
				</select>
			</div>
		</div>
	);
}
