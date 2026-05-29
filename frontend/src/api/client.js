import axios from "axios";

/**
 * Normaliza la URL base para que siempre apunte a /api
 * Ej: http://localhost:3000 -> http://localhost:3000/api
 */
const normalizeApiUrl = (url) => {
  const base = (url || "http://localhost:3000/api").replace(/\/+$/, "");
  if (base.endsWith("/api")) return base;
  return `${base}/api`;
};

// En dev sin VITE_API_URL usa proxy de Vite (/api -> localhost:3000)
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? normalizeApiUrl(import.meta.env.VITE_API_URL)
  : "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error en la solicitud";

    if (import.meta.env.DEV && error.response?.status === 404) {
      console.error(
        `[API 404] ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${error.config?.url}`
      );
    }

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data
    });
  }
);

export default api;
export { API_BASE_URL };
