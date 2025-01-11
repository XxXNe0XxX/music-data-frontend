import axios from "../api/axios";
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";
const BASE_URL = "https://music-data-visualization-backend.onrender.com/api";
// const BASE_URL = "http://localhost:3001";
/**
 * Obtiene las canciones más populares de una región específica.
 * @param {string} regionCode - Código de región (ej. "US", "MX").
 * @returns {Promise<Object>} - Lista de canciones populares.
 * @throws {Error} - Si ocurre un error al obtener las canciones.
 */
// export async function getPopularSongs(regionCode) {
//   try {
//     const response = await axios.get(`spotify/popular/${regionCode}`);

//     // Axios automatically throws an error for status codes outside 2xx
//     // However, if you have custom status codes to handle, you can include additional checks here
//     // For example:
//     // if (response.status === 204) {
//     //   return { songs: [] }; // No Content
//     // }

//     return response.data;
//   } catch (err) {
//     console.error(`Error al obtener las canciones: ${err.message}`);
//     throw err; // Re-throw the error to let the caller handle it
//   }
// }

export async function getPopularSongs(regionCode) {
  const response = await fetch(`${BASE_URL}}/spotify/popular/${regionCode}`);
  if (!response.ok) {
    throw new Error(`Error al obtener los videos: ${response.statusText}`);
  }
  return response.json();
}
