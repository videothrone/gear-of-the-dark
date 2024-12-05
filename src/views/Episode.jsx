import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { useRssFeed } from '../hooks/useFetchRSS';
import { AudioContext } from '../contexts/audioContext';
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

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
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		return [hours, minutes, secs]
			.map((v) => v.toString().padStart(2, '0'))
			.filter((v, i) => !(i === 0 && v === '00'))
			.join(':');
	};

	return (
		<article className="episode" aria-labelledby="episode-title">
			<div className="episode__header">
				<Link to="/archive" className="episode__back-link">
					← Zurück zur Übersicht
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
				{episode.duration && (
					<span className="episode__duration">
						{formatDuration(parseInt(episode.duration))}
					</span>
				)}
			</div>

			<div
				className="episode__description"
				dangerouslySetInnerHTML={{ __html: episode.contentEncoded }}
			/>

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

			<button
				className="episode__play-button"
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
