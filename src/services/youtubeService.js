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
