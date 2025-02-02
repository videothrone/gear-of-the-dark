import { useState, useEffect } from 'react';
import redaxios from 'redaxios';

export default function Videos() {
	const channelId = 'UCJ0WXKxIT8Ujvso5FIH5_eA';
	const ytAPIkey = import.meta.env.VITE_YT_API_KEY;

	const [videos, setVideos] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await redaxios.get(
					`https://www.googleapis.com/youtube/v3/search`,
					{
						params: {
							key: ytAPIkey,
							channelId: channelId,
							part: 'snippet',
							order: 'date',
							maxResults: 20,
						},
					}
				);

				setVideos(response.data.items);
			} catch (error) {
				console.log(error);
				setError(
					'Fehler beim Laden der Videos. Bitte versuche es später erneut.'
				);
			}
		};

		fetchVideos();
	}, [ytAPIkey, channelId]);

	return (
		<div className="videos">
			{error && <p className="videos__error">{error}</p>}
			<ul className="videos__list" aria-live="polite">
				{videos.map((video) => (
					<li key={video.id.videoId} className="videos__item">
						<a
							className="videos__link"
							href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Öffne YouTube Video: ${video.snippet.title}`}
						>
							<img
								className="videos__thumbnail"
								src={video.snippet.thumbnails.medium.url}
								alt={`Thumbnail für: ${video.snippet.title}`}
								loading="lazy"
								width={video.snippet.thumbnails.medium.width}
								height={video.snippet.thumbnails.medium.height}
							/>
							<span className="videos__title-text">{video.snippet.title}</span>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
