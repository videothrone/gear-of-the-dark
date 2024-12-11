import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import validator from 'validator';
import { fetchWithTimeout } from '../helpers/fetchWithTimeout';

export function useRssFeed(url) {
	const [feedItems, setFeedItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFeed = async () => {
			try {
				// Check if the URL is valid
				if (
					!validator.isURL(url, {
						protocols: ['http', 'https'],
						require_protocol: true,
					})
				) {
					throw new Error('Invalid URL');
				}

				// Fetch the RSS feed
				const response = await fetchWithTimeout(url, 5000);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				// Check if the content type is XML
				const contentType = response.headers.get('Content-Type');
				if (
					!contentType ||
					!/^(application\/rss\+xml|application\/xml|text\/xml)/.test(
						contentType.toLowerCase()
					)
				) {
					throw new Error(`Invalid content type: ${contentType}`);
				}

				// Check if the XML is valid
				const text = await response.text();
				if (!/^<\?xml/.test(text)) {
					throw new Error('Invalid XML content');
				}

				// Parse the XML
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(text, 'text/xml');

				// Check if the XML is valid again
				if (xmlDoc.querySelector('parsererror')) {
					throw new Error('Error parsing XML');
				}

				const items = xmlDoc.querySelectorAll('item');
				const feedData = Array.from(items).map((item) => ({
					title: DOMPurify.sanitize(
						item.querySelector('title')?.textContent || ''
					),
					link: DOMPurify.sanitize(
						item.querySelector('link')?.textContent || ''
					),
					pubDate: DOMPurify.sanitize(
						item.querySelector('pubDate')?.textContent || ''
					),
					description: DOMPurify.sanitize(
						item.querySelector('description')?.textContent || ''
					),
					guid: DOMPurify.sanitize(
						item.querySelector('guid')?.textContent || ''
					),
					enclosure: {
						url: DOMPurify.sanitize(
							item.querySelector('enclosure')?.getAttribute('url') || ''
						),
						type: DOMPurify.sanitize(
							item.querySelector('enclosure')?.getAttribute('type') || ''
						),
						length: DOMPurify.sanitize(
							item.querySelector('enclosure')?.getAttribute('length') || ''
						),
					},
					episodeImage: DOMPurify.sanitize(
						item.querySelector('itunes\\:image')?.getAttribute('href') ||
							item.querySelector('[href]')?.getAttribute('href') ||
							''
					),
					duration: DOMPurify.sanitize(
						item.querySelector('itunes\\:duration')?.textContent ||
							item.querySelector('*|duration')?.textContent ||
							''
					),
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
				console.error('Fetch Error:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFeed();
	}, [url]);

	return { feedItems, isLoading, error };
}
