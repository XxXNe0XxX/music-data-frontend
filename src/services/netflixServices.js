// spotifyServices.js

import axios from "../api/axios"; // Ensure this points to your configured Axios instance
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";

/**
 * Obtiene las canciones más populares de una región específica.
 * @param {string} regionCode - Código de región (ej. "US", "MX").
 * @returns {Promise<Array>} - Lista de canciones populares.
 * @throws {Error} - Si ocurre un error al obtener las canciones.
 */
export async function getPopularMovies(regionCode) {
  try {
    // Convert the region code if necessary
    const convertedCode = convertIsoA3ToIsoA2(regionCode);

    const response = await axios.get(
      `/netflix/popular/movies/${convertedCode}`,
      {
        // You can add additional Axios configurations here if needed
      }
    );

    // Axios automatically parses JSON responses
    return response.data.data; // Ensure this matches the expected data structure
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made, and the server responded with a status code outside the 2xx range
      console.error(
        `Error al obtener los audiovisuales: ${error.response.status} - ${error.response.statusText}`
      );
      throw new Error(
        `Error al obtener las audiovisuales: ${error.response.statusText}`
      );
    } else if (error.request) {
      // The request was made, but no response was received
      console.error(
        "No se recibió respuesta del servidor al obtener las audiovisuales."
      );
      throw new Error(
        "No se recibió respuesta del servidor al obtener las audiovisuales."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error al configurar la solicitud: ${error.message}`);
      throw new Error(`Error al configurar la solicitud: ${error.message}`);
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
      }
    );

    // Axios automatically parses JSON responses
    return response.data.data; // Ensure this matches the expected data structure
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made, and the server responded with a status code outside the 2xx range
      console.error(
        `Error al obtener los audiovisuales: ${error.response.status} - ${error.response.statusText}`
      );
      throw new Error(
        `Error al obtener las audiovisuales: ${error.response.statusText}`
      );
    } else if (error.request) {
      // The request was made, but no response was received
      console.error(
        "No se recibió respuesta del servidor al obtener las audiovisuales."
      );
      throw new Error(
        "No se recibió respuesta del servidor al obtener las audiovisuales."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error al configurar la solicitud: ${error.message}`);
      throw new Error(`Error al configurar la solicitud: ${error.message}`);
    }
  }
}
