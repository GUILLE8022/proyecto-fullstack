import { Router } from "express";
import {
  getMarketplace,
  getMisMotos,
  getMotoById,
  crearMoto,
  actualizarMoto,
  eliminarMoto,
  toggleEnVenta,
  marcarComoVendida,
  getTodasMotosAdmin,
  eliminarMotoAdmin
} from "../controllers/moto.controller.v2.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { verificarOwnershipMoto } from "../middlewares/ownership.middleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/marketplace/listado", verificarToken, getMarketplace);
router.get("/mis-motos/listado", verificarToken, getMisMotos);

router.get("/admin/todas", verificarToken, roleMiddleware(["admin"]), getTodasMotosAdmin);
router.delete("/admin/:id", verificarToken, roleMiddleware(["admin"]), eliminarMotoAdmin);

router.get("/:id", getMotoById);

router.post("/", verificarToken, crearMoto);
router.put("/:id", verificarToken, verificarOwnershipMoto, actualizarMoto);
router.patch("/:id/en-venta", verificarToken, verificarOwnershipMoto, toggleEnVenta);
router.post("/:id/marcar-vendida", verificarToken, verificarOwnershipMoto, marcarComoVendida);
router.delete("/:id", verificarToken, verificarOwnershipMoto, eliminarMoto);

export default router;
