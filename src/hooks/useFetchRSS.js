import { useState, useEffect } from 'react';

export function useRssFeed(url) {
	const [feedItems, setFeedItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFeed = async () => {
			try {
				const response = await fetch(url);
				const text = await response.text();
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(text, 'text/xml');

				const items = xmlDoc.querySelectorAll('item');
				const feedData = Array.from(items).map((item) => ({
					title: item.querySelector('title')?.textContent || '',
					link: item.querySelector('link')?.textContent || '',
					pubDate: item.querySelector('pubDate')?.textContent || '',
					description: item.querySelector('description')?.textContent || '',
					guid: item.querySelector('guid')?.textContent || '',
					enclosure: {
						url: item.querySelector('enclosure')?.getAttribute('url') || '',
						type: item.querySelector('enclosure')?.getAttribute('type') || '',
						length:
							item.querySelector('enclosure')?.getAttribute('length') || '',
					},
					episodeImage:
						item.querySelector('itunes\\:image')?.getAttribute('href') ||
						item.querySelector('[href]')?.getAttribute('href') ||
						'',

					duration: item.querySelector('itunes\\:duration')?.textContent || '',
				}));

				setFeedItems(feedData);
			} catch (err) {
				setError('Failed to fetch RSS feed');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFeed();
	}, [url]);

	return { feedItems, isLoading, error };
}
