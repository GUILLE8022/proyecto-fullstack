import { Router } from "express";
import { crearVenta, getVentas } from "../controllers/venta.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, crearVenta);
router.get("/", verificarToken, getVentas);

export default router;