import Moto from "../models/Moto.js";
import Usuario from "../models/Usuario.js";
import Venta from "../models/Venta.js";
import { validateMoto } from "../validators/validations.js";
import { ApiResponse, ApiError, asyncHandler } from "../utils/ApiResponse.js";

const CAMPOS_EDITABLES = [
  "marca",
  "modelo",
  "precio",
  "cilindraje",
  "descripcion",
  "imagen",
  "segmento",
  "enVenta"
];

export const getMarketplace = asyncHandler(async (req, res) => {
  const filtro = { disponible: true, enVenta: true };

  const motos = await Moto.find(filtro)
    .populate("propietario", "nombre email")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, motos, "Marketplace obtenido"));
});

export const getMotoById = asyncHandler(async (req, res) => {
  const moto = await Moto.findById(req.params.id).populate("propietario", "nombre email");

  if (!moto) {
    throw new ApiError(404, "Moto no encontrada");
  }

  res.status(200).json(new ApiResponse(200, moto, "Moto encontrada"));
});

export const getMisMotos = asyncHandler(async (req, res) => {
  const motos = await Moto.find({ propietario: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, motos, "Tus motos"));
});

export const crearMoto = asyncHandler(async (req, res) => {
  const { marca, modelo, precio, cilindraje, descripcion, imagen, segmento, enVenta } = req.body;

  if (!validateMoto({ marca, modelo, precio, cilindraje })) {
    throw new ApiError(400, "Datos de moto inválidos");
  }

  const moto = await Moto.create({
    marca,
    modelo: String(modelo),
    precio,
    cilindraje,
    descripcion,
    imagen: imagen?.trim() || undefined,
    segmento,
    enVenta: enVenta === true || enVenta === "true",
    propietario: req.user.id
  });

  res.status(201).json(new ApiResponse(201, moto, "Moto creada correctamente"));
});

export const actualizarMoto = asyncHandler(async (req, res) => {
  const moto = req.moto;
  const actualizacion = {};

  CAMPOS_EDITABLES.forEach((campo) => {
    if (req.body[campo] !== undefined) {
      if (campo === "enVenta") {
        actualizacion[campo] = req.body[campo] === true || req.body[campo] === "true";
      } else if (campo === "modelo") {
        actualizacion[campo] = String(req.body[campo]);
      } else {
        actualizacion[campo] = req.body[campo];
      }
    }
  });

  if (!moto.disponible && actualizacion.enVenta === true) {
    throw new ApiError(400, "No puedes poner en venta una moto ya vendida");
  }

  const motoActualizada = await Moto.findByIdAndUpdate(moto._id, actualizacion, {
    new: true,
    runValidators: true
  });

  res.status(200).json(new ApiResponse(200, motoActualizada, "Moto actualizada"));
});

export const toggleEnVenta = asyncHandler(async (req, res) => {
  const moto = req.moto;

  if (!moto.disponible) {
    throw new ApiError(400, "Esta moto ya fue vendida");
  }

  moto.enVenta = !moto.enVenta;
  await moto.save();

  res.status(200).json(
    new ApiResponse(
      200,
      moto,
      moto.enVenta ? "Moto publicada en el marketplace" : "Moto retirada del marketplace"
    )
  );
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const marcarComoVendida = asyncHandler(async (req, res) => {
  const moto = req.moto;
  const { compradorEmail, compradorNombre, nota } = req.body;

  if (!moto.disponible) {
    throw new ApiError(400, "Esta moto ya está marcada como vendida");
  }

  const email = compradorEmail?.trim().toLowerCase() || "";
  const nombre = compradorNombre?.trim() || "";

  if (!nombre) {
    throw new ApiError(400, "El nombre del comprador es obligatorio");
  }

  if (!email) {
    throw new ApiError(400, "El email del comprador es obligatorio");
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(400, "El email del comprador no tiene un formato válido");
  }

  let compradorId = null;
  let nombreComprador = nombre;

  const comprador = await Usuario.findOne({ email });
  if (comprador) {
    compradorId = comprador._id;
    nombreComprador = comprador.nombre;
  }

  const venta = await Venta.create({
    comprador: compradorId,
    compradorNombre: nombreComprador,
    vendedor: req.user.id,
    moto: moto._id,
    cantidad: 1,
    precioTotal: moto.precio,
    tipo: compradorId ? "marketplace" : "directa",
    estado: "completada",
    nota: nota || ""
  });

  moto.disponible = false;
  moto.enVenta = false;
  await moto.save();

  await venta.populate([
    { path: "comprador", select: "nombre email" },
    { path: "moto", select: "marca modelo precio imagen" }
  ]);

  res.status(201).json(
    new ApiResponse(201, { venta, moto }, "Venta registrada correctamente")
  );
});

export const eliminarMoto = asyncHandler(async (req, res) => {
  if (!req.moto.disponible) {
    throw new ApiError(
      400,
      "No se puede eliminar una moto vendida. Forma parte del historial de ventas."
    );
  }

  await Moto.findByIdAndDelete(req.moto._id);

  res.status(200).json(new ApiResponse(200, null, "Moto eliminada correctamente"));
});

export const getTodasMotosAdmin = asyncHandler(async (req, res) => {
  const motos = await Moto.find()
    .populate("propietario", "nombre email rol")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, motos, "Todas las motos (admin)"));
});

export const eliminarMotoAdmin = asyncHandler(async (req, res) => {
  const moto = await Moto.findByIdAndDelete(req.params.id);

  if (!moto) {
    throw new ApiError(404, "Moto no encontrada");
  }

  res.status(200).json(new ApiResponse(200, null, "Moto eliminada por administrador"));
});
