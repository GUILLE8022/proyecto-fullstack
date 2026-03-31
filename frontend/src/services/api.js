import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

// agregar token automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});