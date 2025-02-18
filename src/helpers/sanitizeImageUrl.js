/**
 * Sanitizes image URLs to remove any URL parameters.
 *
 * @param {string} url The image URL to sanitize.
 * @returns {string} The sanitized image URL.
 */
export function sanitizeImageUrl(url) {
	if (url.startsWith('https://images.podigee-cdn.net/')) {
		const parts = url.split('=');
		if (parts.length > 1) {
			const sanitizedUrl = parts[parts.length - 1];
			// Remove any leading slash
			return sanitizedUrl.startsWith('/')
				? sanitizedUrl.slice(1)
				: sanitizedUrl;
		}
	}
	return url;
}
