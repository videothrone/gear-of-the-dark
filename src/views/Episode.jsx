import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { useRssFeed } from '../hooks/useFetchRSS';
import { AudioContext } from '../contexts/audioContext';
import { FaDownload, FaPlay, FaPause } from 'react-icons/fa';
import { formatDuration } from '../helpers/formatDuration';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const RSS_FEED_URL = import.meta.env.VITE_RSS_FEED_URL;

export default function Episode() {
	const { guid } = useParams();
	const { feedItems, isLoading, error } = useRssFeed(RSS_FEED_URL);
	const { activeEpisode, isPlaying, onPlay, onPause, onResume } =
		useContext(AudioContext);

	if (isLoading) {
		return (
			<div className="episode episode--loading" aria-live="polite">
				<Loader />
			</div>
		);
	}

	if (error) {
		return (
			<article className="episode" aria-labelledby="episode-title">
				<div className="episode__header">
					<Link to="/archive" className="episode__back-link">
						← Alle Episoden
					</Link>
				</div>
				<ErrorMessage message={error.message} />
			</article>
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
	const duration = formatDuration(episode.duration);

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

	return (
		<article className="episode" aria-labelledby="episode-title">
			<div className="episode__header">
				<Link to="/archive" className="episode__back-link">
					← Alle Episoden
				</Link>
				<div className="episode__header-main">
					<div className="episode__image">
						<img src={episode.episodeImage} alt={episode.title} />
					</div>
					<div className="episode__info">
						<h1 id="episode-title" className="episode__title">
							{episode.title}
						</h1>
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
								aria-label={
									isPlaying && isActive
										? 'Episode pausieren'
										: 'Episode abspielen'
								}
							>
								{isPlaying && isActive ? <FaPause /> : <FaPlay />}
							</button>
							<div className="episode__links">
								<a
									href={episode.enclosure.url}
									download
									className="episode__download-link"
								>
									<FaDownload /> Download
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				className="episode__description"
				dangerouslySetInnerHTML={{ __html: episode.contentEncoded }}
			/>
		</article>
	);
}
