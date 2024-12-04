import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AudioContext } from '../contexts/audioContext';

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
			<h2 className="card__title">
				<Link to={`/episode/${encodeURIComponent(item.guid)}`}>
					{item.title}
				</Link>
			</h2>
			<p className="card__date">
				<time dateTime={item.pubDate}>
					{new Date(item.pubDate).toLocaleDateString()}
				</time>
			</p>
			<div
				className="card__description"
				dangerouslySetInnerHTML={{ __html: item.description }}
			/>
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
				{isActive ? (isPlaying ? 'Pausieren' : 'Fortsetzen') : 'Abspielen'}
			</button>
		</article>
	);
}
