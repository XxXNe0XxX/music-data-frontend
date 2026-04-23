// spotifyServices.js

import axios from "../api/axios"; // Ensure this points to your configured Axios instance
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";

/**
 * Gets the most popular songs for a specific region.
 * @param {string} regionCode - Region code (e.g., "US", "MX").
 * @returns {Promise<Array>} - List of popular songs.
 * @throws {Error} - If an error occurs while fetching the songs.
 */
export async function getPopularSongs(regionCode) {
  try {
    // Convert the region code if necessary
    const convertedCode = convertIsoA3ToIsoA2(regionCode);

    const response = await axios.get(`/spotify/popular/${convertedCode}`, {
      // You can add additional Axios configurations here if needed
    });

    // Axios automatically parses JSON responses
    return response.data.data; // Ensure this matches the expected data structure
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made, and the server responded with a status code outside the 2xx range
      console.error(
        `Failed to fetch popular songs: ${error.response.status} - ${error.response.statusText}`,
      );
      throw new Error(
        `Failed to fetch popular songs: ${error.response.statusText}`,
      );
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("No server response received when fetching popular songs.");
      throw new Error(
        "No server response received when fetching popular songs.",
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error setting up the request: ${error.message}`);
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
}
