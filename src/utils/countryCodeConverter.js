import iso3To2 from "country-iso-3-to-2";

/**
 * Convierte un código ISO_A3 a ISO_A2.
 * @param {string} isoA3Code - Código en formato ISO_A3.
 * @returns {string} - Código en formato ISO_A2 o el mismo código si no hay mapeo.
 */
export function convertIsoA3ToIsoA2(isoA3Code) {
  return iso3To2(isoA3Code) || isoA3Code;
}
