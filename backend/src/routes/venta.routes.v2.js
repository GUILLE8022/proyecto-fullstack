import { Router } from "express";
import {
  crearVenta,
  getVentasUsuario,
  getVentasComoVendedor,
  getHistorialCompleto,
  todasLasVentas,
  estadisticas
} from "../controllers/venta.controller.v2.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/", verificarToken, crearVenta);
router.get("/historial/completo", verificarToken, getHistorialCompleto);
router.get("/mis-compras/listado", verificarToken, getVentasUsuario);
router.get("/mis-ventas/listado", verificarToken, getVentasComoVendedor);
router.get("/estadisticas/usuario", verificarToken, estadisticas);

// Admin — historial global (solo lectura)
router.get("/admin/todas", verificarToken, roleMiddleware(["admin"]), todasLasVentas);

export default router;
