import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";
const BASE_URL = "http://localhost:3001/api/youtube";

/**
 * Obtiene los videos más populares de una región específica.
 * @param {string} regionCode - Código de región (ej. "US", "MX").
 * @returns {Promise<Object>} - Lista de videos populares.
 */
export async function getPopularVideos(regionCode) {
  const response = await fetch(`${BASE_URL}/popular/${regionCode}`);
  if (!response.ok) {
    throw new Error(`Error al obtener los videos: ${response.statusText}`);
  }
  return response.json();
}
export async function getFlag(regionCode) {
  try {
    const convertedCode = convertIsoA3ToIsoA2(regionCode);
    const response = await fetch(`${BASE_URL}/flag/${convertedCode}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch flag: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );
    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    console.error("Error fetching flag:", error);
    throw error;
  }
}
