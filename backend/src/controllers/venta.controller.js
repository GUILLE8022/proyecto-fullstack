import Venta from "../models/Venta.js";

export const crearVenta = async (req, res) => {
  const venta = await Venta.create({
    usuario: req.user.id,
    moto: req.body.motoId
  });

  res.json(venta);
};

export const getVentas = async (req, res) => {
  const ventas = await Venta.find()
    .populate("usuario")
    .populate("moto");

  res.json(ventas);
};