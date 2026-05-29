import { ApiResponse, asyncHandler } from "../utils/ApiResponse.js";

export const subirImagenMoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No se recibió ninguna imagen"
    });
  }

  const imagenUrl = `/uploads/motos/${req.file.filename}`;

  res.status(201).json(
    new ApiResponse(201, { imagen: imagenUrl, filename: req.file.filename }, "Imagen subida")
  );
});
