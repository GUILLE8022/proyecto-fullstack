import { Router } from "express";
import {
  getMotos,
  getMotoById,
  crearMoto,
  actualizarMoto,
  eliminarMoto
} from "../controllers/moto.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getMotos);
router.get("/:id", getMotoById);
router.post("/", verificarToken, crearMoto);
router.put("/:id", verificarToken, actualizarMoto);
router.delete("/:id", verificarToken, eliminarMoto);

export default router;