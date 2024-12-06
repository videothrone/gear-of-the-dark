import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { useRssFeed } from '../hooks/useFetchRSS';
import { AudioContext } from '../contexts/audioContext';
import { FaDownload, FaExternalLinkAlt, FaPlay, FaPause } from 'react-icons/fa';

export default function Episode() {
	const { guid } = useParams();
	const { feedItems, isLoading, error } = useRssFeed(
		'https://gearofthedark.podigee.io/feed/mp3'
	);
	const { activeEpisode, isPlaying, onPlay, onPause, onResume } =
		useContext(AudioContext);

	if (isLoading) {
		return (
			<div className="episode episode--loading" aria-live="polite">
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className="episode episode--error" aria-live="assertive">
				Error: {error}
			</div>
		);
	}

	const episode = feedItems.find(
		(item) => item.guid === decodeURIComponent(guid)
	);

	if (!episode) {
		return (
			<div className="episode episode--not-found">Episode nicht gefunden</div>
		);
	}

	const isActive = activeEpisode && activeEpisode.guid === episode.guid;

	const handlePlay = () => {
		if (isActive) {
			if (isPlaying) {
				onPause();
			} else {
				onResume();
			}
		} else {
			onPlay(episode);
		}
	};

	const formatDuration = (seconds) => {
		const totalSeconds = parseInt(seconds, 10);

		// If the duration is not a valid number, return '00:00'
		if (isNaN(totalSeconds)) {
			return '00:00';
		}

		const minutes = Math.floor(totalSeconds / 60);
		const remainingSeconds = totalSeconds % 60;

		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
			.toString()
			.padStart(2, '0')}`;
	};

	const duration = formatDuration(episode.duration);

	return (
		<article className="episode" aria-labelledby="episode-title">
			<div className="episode__header">
				<Link to="/archive" className="episode__back-link">
					← Alle Episoden
				</Link>
				<h1 id="episode-title" className="episode__title">
					{episode.title}
				</h1>
			</div>

			<div className="episode__image">
				<img src={episode.episodeImage} alt={episode.title} />
			</div>

			<div className="episode__meta">
				<time className="episode__date" dateTime={episode.pubDate}>
					{new Intl.DateTimeFormat('de-DE', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
					}).format(new Date(episode.pubDate))}
				</time>

				<span className="episode__duration">{duration} min</span>
			</div>

			<div className="episode__controls">
				<button
					className="episode__play-button"
					onClick={handlePlay}
					aria-label={isPlaying ? 'Episode pausieren' : 'Episode fortsetzen'}
				>
					{isPlaying ? <FaPause /> : <FaPlay />}
				</button>
				<div className="episode__links">
					<a
						href={episode.link}
						target="_blank"
						rel="noopener noreferrer"
						className="episode__external-link"
					>
						<FaExternalLinkAlt /> Zur Episode auf Podigee
					</a>
					<a
						href={episode.enclosureUrl}
						download
						className="episode__download-link"
					>
						<FaDownload /> Download
					</a>
				</div>
			</div>

			<div
				className="episode__description"
				dangerouslySetInnerHTML={{ __html: episode.contentEncoded }}
			/>
		</article>
	);
}
