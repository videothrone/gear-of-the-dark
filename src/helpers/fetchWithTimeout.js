/**
 * Fetches a resource from the network, but aborts if it takes longer than the specified timeout.
 *
 * @param {string} url - The URL to fetch.
 * @param {number} timeout - The time in milliseconds to wait before aborting the fetch.
 * @returns {Promise<Response>} - A promise that resolves to the Response object representing the response to the request.
 * @throws {Error} - Throws an error if the fetch is aborted or fails.
 */
export async function fetchWithTimeout(url, timeout) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, { signal: controller.signal });
		clearTimeout(id);
		return response;
	} catch (error) {
		clearTimeout(id);
		throw error;
	}
}
