// spotifyServices.js

import axios from "../api/axios"; // Ensure this points to your configured Axios instance
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";

/**
 * Gets the most popular movies for a specific region.
 * @param {string} regionCode - Region code (e.g., "US", "MX").
 * @returns {Promise<Array>} - List of popular movies.
 * @throws {Error} - If an error occurs while fetching the movies.
 */
export async function getPopularMovies(regionCode) {
  try {
    // Convert the region code if necessary
    const convertedCode = convertIsoA3ToIsoA2(regionCode);

    const response = await axios.get(
      `/netflix/popular/movies/${convertedCode}`,
      {
        // You can add additional Axios configurations here if needed
      },
    );

    // Axios automatically parses JSON responses
    return response.data.data; // Ensure this matches the expected data structure
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made, and the server responded with a status code outside the 2xx range
      console.error(
        `Error fetching movies: ${error.response.status} - ${error.response.statusText}`,
      );
      throw new Error(`Error fetching movies: ${error.response.statusText}`);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("No server response received when fetching movies.");
      throw new Error("No server response received when fetching movies.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error setting up the request: ${error.message}`);
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
}

export async function getPopularShows(regionCode) {
  try {
    // Convert the region code if necessary
    const convertedCode = convertIsoA3ToIsoA2(regionCode);

    const response = await axios.get(
      `/netflix/popular/shows/${convertedCode}`,
      {
        // You can add additional Axios configurations here if needed
      },
    );

    // Axios automatically parses JSON responses
    return response.data.data; // Ensure this matches the expected data structure
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made, and the server responded with a status code outside the 2xx range
      console.error(
        `Error fetching shows: ${error.response.status} - ${error.response.statusText}`,
      );
      throw new Error(`Error fetching shows: ${error.response.statusText}`);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("No server response received when fetching shows.");
      throw new Error("No server response received when fetching shows.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error setting up the request: ${error.message}`);
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
}
