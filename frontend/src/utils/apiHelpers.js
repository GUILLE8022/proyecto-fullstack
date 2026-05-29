/**
 * Extrae el payload de la respuesta estándar del backend.
 * Formato: { success, message, data }
 */
export const extractData = (response) => {
  if (response === null || response === undefined) return response;
  if (typeof response === "object" && "data" in response) {
    return response.data;
  }
  return response;
};
