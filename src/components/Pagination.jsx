import {
	FaChevronLeft,
	FaChevronRight,
	FaStepBackward,
	FaStepForward,
} from 'react-icons/fa';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
	return (
		<nav className="pagination" aria-label="Pagination">
			<ul className="pagination__list">
				<li className="pagination__item">
					<button
						className="pagination__button"
						onClick={() => onPageChange(1)}
						disabled={currentPage === 1}
						aria-label="Zur ersten Seite"
					>
						<FaStepBackward aria-hidden="true" />
					</button>
				</li>
				<li className="pagination__item">
					<button
						className="pagination__button"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						aria-label="Zur letzten Seite"
					>
						<FaChevronLeft aria-hidden="true" />
					</button>
				</li>
				<li className="pagination__item pagination__info" aria-current="page">
					<span className="pagination__text">
						Seite {currentPage} von {totalPages}
					</span>
				</li>
				<li className="pagination__item">
					<button
						className="pagination__button"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						aria-label="Zur nächsten Seite"
					>
						<FaChevronRight aria-hidden="true" />
					</button>
				</li>
				<li className="pagination__item">
					<button
						className="pagination__button"
						onClick={() => onPageChange(totalPages)}
						disabled={currentPage === totalPages}
						aria-label="Zur letzten Seite"
					>
						<FaStepForward aria-hidden="true" />
					</button>
				</li>
			</ul>
		</nav>
	);
}
