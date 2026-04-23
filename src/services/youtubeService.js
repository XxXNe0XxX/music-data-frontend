// youtubeService.js

import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";
import axios from "../api/axios"; // Ensure this points to your configured Axios instance

/**
 * Gets the most popular videos for a specific region.
 * @param {string} regionCode - Region code (e.g., "US", "MX").
 * @returns {Promise<Object>} - List of popular videos.
 * @throws {Error} - If an error occurs while fetching the videos.
 */
export async function getPopularVideos(regionCode) {
  try {
    const response = await axios.get(`youtube/popular/videos/${regionCode}`);
    return response.data.data; // Axios automatically parses JSON
  } catch (error) {
    // More detailed error handling
    if (error.response) {
      // The server responded with a status outside the 2xx range
      console.error(
        `Error fetching videos: ${error.response.status} - ${error.response.statusText}`,
      );
      throw new Error(`Error fetching videos: ${error.response.statusText}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No server response received when fetching videos.");
      throw new Error("No server response received when fetching videos.");
    } else {
      // Something happened in setting up the request that triggered an error
      console.error(`Error setting up the request: ${error.message}`);
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
}

/**
 * Gets the channel information for a specific channel.
 * @param {string} channelId - Channel ID.
 * @returns {Promise<Object>} - Channel information.
 * @throws {Error} - If an error occurs while fetching the channel information.
 */
export async function getChannelInfo(channelId) {
  try {
    const response = await axios.get(`youtube/popular/channel/${channelId}`);
    return response.data.data; // Axios automatically parses JSON
  } catch (error) {
    if (error.response) {
      console.error(
        `Error fetching channel information: ${error.response.status} - ${error.response.statusText}`,
      );
      throw new Error(
        `Error fetching channel information: ${error.response.statusText}`,
      );
    } else if (error.request) {
      console.error(
        "No server response received when fetching channel information.",
      );
      throw new Error(
        "No server response received when fetching channel information.",
      );
    } else {
      console.error(`Error setting up the request: ${error.message}`);
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
}

/**
 * Gets the flag for a specific region.
 * @param {string} regionCode - Region code (e.g., "US", "MX").
 * @returns {Promise<string>} - Flag URL in base64 format.
 * @throws {Error} - If an error occurs while fetching the flag.
 */
export async function getFlag(regionCode) {
  try {
    const convertedCode = convertIsoA3ToIsoA2(regionCode);
    const response = await axios.get(`youtube/flag/${convertedCode}`, {
      responseType: "arraybuffer", // Necessary to handle binary data
    });

    // Convert the ArrayBuffer to a base64 string
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(response.data)),
    );

    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error fetching flag: ${error.response.status} - ${error.response.statusText}`,
      );
      throw new Error(`Error fetching flag: ${error.response.statusText}`);
    } else if (error.request) {
      console.error("No server response received when fetching the flag.");
      throw new Error("No server response received when fetching the flag.");
    } else {
      console.error(`Error setting up the request: ${error.message}`);
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
}
