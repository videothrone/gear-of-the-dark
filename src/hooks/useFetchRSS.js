import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export function useRssFeed(url) {
	const [feedItems, setFeedItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFeed = async () => {
			try {
				// Check if the URL is valid
				if (!/^https?:\/\//i.test(url)) {
					throw new Error('Invalid URL scheme');
				}

				const response = await fetch(url);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				// Check if the content type is XML
				const contentType = response.headers.get('Content-Type');
				if (!contentType || !contentType.includes('xml')) {
					throw new Error(`Invalid content type: ${contentType}`);
				}

				const text = await response.text();
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(text, 'text/xml');

				// Check if the XML is valid
				if (xmlDoc.querySelector('parsererror')) {
					throw new Error('Error parsing XML');
				}

				const items = xmlDoc.querySelectorAll('item');
				const feedData = Array.from(items).map((item) => ({
					title: DOMPurify.sanitize(
						item.querySelector('title')?.textContent || ''
					),
					link: item.querySelector('link')?.textContent || '',
					pubDate: item.querySelector('pubDate')?.textContent || '',
					description: DOMPurify.sanitize(
						item.querySelector('description')?.textContent || ''
					),
					guid: item.querySelector('guid')?.textContent || '',
					enclosure: {
						url: DOMPurify.sanitize(
							item.querySelector('enclosure')?.getAttribute('url') || ''
						),
						type: item.querySelector('enclosure')?.getAttribute('type') || '',
						length:
							item.querySelector('enclosure')?.getAttribute('length') || '',
					},
					episodeImage: DOMPurify.sanitize(
						item.querySelector('itunes\\:image')?.getAttribute('href') ||
							item.querySelector('[href]')?.getAttribute('href') ||
							''
					),
					duration: item.querySelector('itunes\\:duration')?.textContent || '',
					contentEncoded: DOMPurify.sanitize(
						item.querySelector('content\\:encoded, encoded')?.textContent ||
							item.getElementsByTagNameNS(
								'http://purl.org/rss/1.0/modules/content/',
								'encoded'
							)[0]?.textContent ||
							''
					),
				}));

				setFeedItems(feedData);
			} catch (error) {
				setError(`Failed to fetch RSS feed: ${error.message}`);
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFeed();
	}, [url]);

	return { feedItems, isLoading, error };
}
