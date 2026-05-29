import Moto from "../models/Moto.js";
import { ApiError } from "../utils/ApiResponse.js";

/**
 * Verifica que el usuario sea propietario de la moto o admin.
 * Debe usarse después de verificarToken.
 */
export const verificarOwnershipMoto = async (req, res, next) => {
  try {
    const moto = await Moto.findById(req.params.id);

    if (!moto) {
      throw new ApiError(404, "Moto no encontrada");
    }

    const esAdmin = req.user.role === "admin";
    const esPropietario = moto.propietario.toString() === req.user.id;

    if (!esAdmin && !esPropietario) {
      throw new ApiError(403, "No tienes permiso para modificar esta moto");
    }

    req.moto = moto;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error al verificar permisos"
    });
  }
};
