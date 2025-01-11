// youtubeService.js

import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";
import axios from "../api/axios"; // Ensure this points to your configured Axios instance

/**
 * Obtiene los videos más populares de una región específica.
 * @param {string} regionCode - Código de región (ej. "US", "MX").
 * @returns {Promise<Object>} - Lista de videos populares.
 * @throws {Error} - Si ocurre un error al obtener los videos.
 */
export async function getPopularVideos(regionCode) {
  try {
    const response = await axios.get(`youtube/popular/videos/${regionCode}`);
    return response.data; // Axios automáticamente parsea el JSON
  } catch (error) {
    // Manejo de errores más detallado
    if (error.response) {
      // El servidor respondió con un estado fuera del rango 2xx
      console.error(
        `Error al obtener los videos: ${error.response.status} - ${error.response.statusText}`
      );
      throw new Error(
        `Error al obtener los videos: ${error.response.statusText}`
      );
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      console.error(
        "No se recibió respuesta del servidor al obtener los videos."
      );
      throw new Error(
        "No se recibió respuesta del servidor al obtener los videos."
      );
    } else {
      // Algo ocurrió al configurar la solicitud que desencadenó un error
      console.error(`Error al configurar la solicitud: ${error.message}`);
      throw new Error(`Error al configurar la solicitud: ${error.message}`);
    }
  }
}

/**
 * Obtiene la información del canal de un canal específico.
 * @param {string} channelId - ID del canal.
 * @returns {Promise<Object>} - Información del canal.
 * @throws {Error} - Si ocurre un error al obtener la información del canal.
 */
export async function getChannelInfo(channelId) {
  try {
    const response = await axios.get(`youtube/popular/channel/${channelId}`);
    return response.data; // Axios automáticamente parsea el JSON
  } catch (error) {
    if (error.response) {
      console.error(
        `Error al obtener la información del canal: ${error.response.status} - ${error.response.statusText}`
      );
      throw new Error(
        `Error al obtener la información del canal: ${error.response.statusText}`
      );
    } else if (error.request) {
      console.error(
        "No se recibió respuesta del servidor al obtener la información del canal."
      );
      throw new Error(
        "No se recibió respuesta del servidor al obtener la información del canal."
      );
    } else {
      console.error(`Error al configurar la solicitud: ${error.message}`);
      throw new Error(`Error al configurar la solicitud: ${error.message}`);
    }
  }
}

/**
 * Obtiene la bandera de una región específica.
 * @param {string} regionCode - Código de región (ej. "US", "MX").
 * @returns {Promise<string>} - URL de la bandera en formato base64.
 * @throws {Error} - Si ocurre un error al obtener la bandera.
 */
export async function getFlag(regionCode) {
  try {
    const convertedCode = convertIsoA3ToIsoA2(regionCode);
    const response = await axios.get(`youtube/flag/${convertedCode}`, {
      responseType: "arraybuffer", // Necesario para manejar datos binarios
    });

    // Convertir el ArrayBuffer a una cadena base64
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(response.data))
    );

    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error al obtener la bandera: ${error.response.status} - ${error.response.statusText}`
      );
      throw new Error(
        `Error al obtener la bandera: ${error.response.statusText}`
      );
    } else if (error.request) {
      console.error(
        "No se recibió respuesta del servidor al obtener la bandera."
      );
      throw new Error(
        "No se recibió respuesta del servidor al obtener la bandera."
      );
    } else {
      console.error(`Error al configurar la solicitud: ${error.message}`);
      throw new Error(`Error al configurar la solicitud: ${error.message}`);
    }
  }
}
