/**
 * Format a duration in seconds as a string in the format 'mm:ss'.
 *
 * @param {number} seconds - Duration in seconds.
 * @returns {string} Formatted string.
 */
export function formatDuration(seconds) {
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
}
