/**
 * Converts milliseconds to a formatted string in minutes and seconds.
 * @param {number} ms - The time in milliseconds.
 * @returns {string} - The formatted time as "mm:ss".
 */
export function millisToMinutesAndSeconds(ms) {
  const minutes = Math.floor(ms / 60000); // Convert milliseconds to minutes
  const seconds = Math.floor((ms % 60000) / 1000); // Get remaining seconds
  return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Pad seconds with 0 if needed
}
