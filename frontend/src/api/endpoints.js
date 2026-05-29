import api from "./client.js";
import { extractData } from "../utils/apiHelpers.js";
import { getApiOrigin } from "../utils/imageUrl.js";

const wrap = (promise) => promise.then(extractData);

export const authAPI = {
  register: (data) => wrap(api.post("/auth/register", data)),
  login: (data) => wrap(api.post("/auth/login", data)),
  getProfile: () => wrap(api.get("/auth/profile")),
  getUsuarios: () => wrap(api.get("/auth/usuarios")),
  toggleUsuario: (id) => wrap(api.patch(`/auth/usuarios/${id}/toggle`))
};

export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("imagen", file);

    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/+$/, "").replace(/\/api$/, "") + "/api"
      : "/api";

    const response = await fetch(`${baseUrl}/upload/imagen`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw { message: json.message || "Error al subir imagen" };
    }
    return json.data;
  }
};

export const motosAPI = {
  getMarketplace: () => wrap(api.get("/motos/marketplace/listado")),
  getMisMotos: () => wrap(api.get("/motos/mis-motos/listado")),
  getById: (id) => wrap(api.get(`/motos/${id}`)),
  create: (data) => wrap(api.post("/motos", data)),
  update: (id, data) => wrap(api.put(`/motos/${id}`, data)),
  delete: (id) => wrap(api.delete(`/motos/${id}`)),
  toggleEnVenta: (id) => wrap(api.patch(`/motos/${id}/en-venta`)),
  marcarVendida: (id, data) => wrap(api.post(`/motos/${id}/marcar-vendida`, data)),
  getAllAdmin: () => wrap(api.get("/motos/admin/todas")),
  deleteAdmin: (id) => wrap(api.delete(`/motos/admin/${id}`))
};

export const ventasAPI = {
  crear: (data) => wrap(api.post("/ventas", data)),
  getHistorial: () => wrap(api.get("/ventas/historial/completo")),
  getMisCompras: () => wrap(api.get("/ventas/mis-compras/listado")),
  getMisVentas: () => wrap(api.get("/ventas/mis-ventas/listado")),
  getEstadisticas: () => wrap(api.get("/ventas/estadisticas/usuario")),
  getAllAdmin: () => wrap(api.get("/ventas/admin/todas"))
};

export { getApiOrigin };
