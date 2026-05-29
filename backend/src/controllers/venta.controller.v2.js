import Venta from "../models/Venta.js";
import Moto from "../models/Moto.js";
import { ApiResponse, ApiError, asyncHandler } from "../utils/ApiResponse.js";

export const crearVenta = asyncHandler(async (req, res) => {
  const { motoId } = req.body;

  if (!motoId) {
    throw new ApiError(400, "ID de moto requerido");
  }

  const moto = await Moto.findById(motoId);
  if (!moto) {
    throw new ApiError(404, "Moto no encontrada");
  }

  if (!moto.disponible) {
    throw new ApiError(400, "Esta moto ya no está disponible");
  }

  if (!moto.enVenta) {
    throw new ApiError(400, "Esta moto no está en venta en el marketplace");
  }

  if (moto.propietario.toString() === req.user.id) {
    throw new ApiError(400, "No puedes comprar tu propia moto");
  }

  const venta = await Venta.create({
    comprador: req.user.id,
    compradorNombre: "",
    vendedor: moto.propietario,
    moto: motoId,
    cantidad: 1,
    precioTotal: moto.precio,
    tipo: "marketplace",
    estado: "completada"
  });

  moto.disponible = false;
  moto.enVenta = false;
  await moto.save();

  await venta.populate([
    { path: "comprador", select: "nombre email" },
    { path: "vendedor", select: "nombre email" },
    { path: "moto", select: "marca modelo precio imagen" }
  ]);

  res.status(201).json(new ApiResponse(201, venta, "Compra realizada exitosamente"));
});

export const getVentasUsuario = asyncHandler(async (req, res) => {
  const ventas = await Venta.find({ comprador: req.user.id })
    .populate("vendedor", "nombre email")
    .populate("moto", "marca modelo precio imagen")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, ventas, "Historial de compras"));
});

export const getVentasComoVendedor = asyncHandler(async (req, res) => {
  const ventas = await Venta.find({ vendedor: req.user.id })
    .populate("comprador", "nombre email")
    .populate("moto", "marca modelo precio imagen")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, ventas, "Historial de ventas"));
});

export const getHistorialCompleto = asyncHandler(async (req, res) => {
  const [compras, ventas] = await Promise.all([
    Venta.find({ comprador: req.user.id })
      .populate("vendedor", "nombre email")
      .populate("moto", "marca modelo precio imagen")
      .sort({ createdAt: -1 }),
    Venta.find({ vendedor: req.user.id })
      .populate("comprador", "nombre email")
      .populate("moto", "marca modelo precio imagen")
      .sort({ createdAt: -1 })
  ]);

  const totalComprado = compras.reduce((sum, v) => sum + v.precioTotal, 0);
  const totalVendido = ventas.reduce((sum, v) => sum + v.precioTotal, 0);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        compras,
        ventas,
        totalComprado,
        totalVendido,
        cantidadCompras: compras.length,
        cantidadVentas: ventas.length
      },
      "Historial completo"
    )
  );
});

export const todasLasVentas = asyncHandler(async (req, res) => {
  const ventas = await Venta.find()
    .populate("comprador", "nombre email")
    .populate("vendedor", "nombre email")
    .populate("moto", "marca modelo precio imagen")
    .sort({ createdAt: -1 });

  const totalVendido = ventas.reduce((sum, v) => sum + v.precioTotal, 0);

  res.status(200).json(
    new ApiResponse(200, { ventas, totalVendido, cantidad: ventas.length }, "Todas las ventas")
  );
});

export const estadisticas = asyncHandler(async (req, res) => {
  const compras = await Venta.find({ comprador: req.user.id });
  const ventas = await Venta.find({ vendedor: req.user.id });

  const totalCompras = compras.reduce((sum, v) => sum + v.precioTotal, 0);
  const totalVentas = ventas.reduce((sum, v) => sum + v.precioTotal, 0);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCompras,
        totalVentas,
        cantidadCompras: compras.length,
        cantidadVentas: ventas.length,
        balance: totalVentas - totalCompras
      },
      "Estadísticas"
    )
  );
});
