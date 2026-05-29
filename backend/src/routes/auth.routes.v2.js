import { Router } from "express";
import {
  register,
  login,
  getProfile,
  getAllUsuarios,
  toggleUsuarioActivo
} from "../controllers/auth.controller.v2.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verificarToken, getProfile);

router.get("/usuarios", verificarToken, roleMiddleware(["admin"]), getAllUsuarios);
router.patch("/usuarios/:id/toggle", verificarToken, roleMiddleware(["admin"]), toggleUsuarioActivo);

export default router;
