import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AudioContext } from '../contexts/audioContext';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function Card({ item }) {
	const { activeEpisode, isPlaying, onPlay, onPause, onResume } =
		useContext(AudioContext);

	const isActive = activeEpisode && activeEpisode.guid === item.guid;

	const handlePlay = () => {
		if (isActive) {
			if (isPlaying) {
				onPause();
			} else {
				onResume();
			}
		} else {
			onPlay(item);
		}
	};

	return (
		<article className="card">
			<div className="card__image-container">
				<img src={item.episodeImage} alt={item.title} className="card__image" />
				<button
					className="card__play-button"
					onClick={handlePlay}
					aria-label={
						isActive
							? isPlaying
								? 'Episode pausieren'
								: 'Episode fortsetzen'
							: 'Episode abspielen'
					}
				>
					{isActive && isPlaying ? (
						<FaPause className="card__play-icon" />
					) : (
						<FaPlay className="card__play-icon" />
					)}
				</button>
			</div>
			<div className="card__content">
				<h2 className="card__title">
					<Link to={`/episode/${encodeURIComponent(item.guid)}`}>
						{item.title}
					</Link>
				</h2>
				<p className="card__date">
					<time dateTime={item.pubDate}>
						{new Intl.DateTimeFormat('de-DE', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
						}).format(new Date(item.pubDate))}
					</time>
				</p>
				<div
					className="card__description"
					dangerouslySetInnerHTML={{ __html: item.description }}
				/>
			</div>
		</article>
	);
}
