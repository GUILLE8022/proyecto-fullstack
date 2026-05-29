import { ApiError } from "../utils/ApiResponse.js";

export const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Usuario no autenticado");
      }

      const userRole = req.user.role || "user";

      if (!requiredRoles.includes(userRole)) {
        throw new ApiError(403, "No tienes permiso para realizar esta acción");
      }

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
        message: "Error en verificación de rol" 
      });
    }
  };
};
