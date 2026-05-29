import { Router } from "express";
import { uploadMotoImage } from "../config/upload.js";
import { subirImagenMoto } from "../controllers/upload.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { ApiError } from "../utils/ApiResponse.js";

const router = Router();

router.post(
  "/imagen",
  verificarToken,
  (req, res, next) => {
    uploadMotoImage.single("imagen")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Error al subir imagen"
        });
      }
      next();
    });
  },
  subirImagenMoto
);

export default router;
