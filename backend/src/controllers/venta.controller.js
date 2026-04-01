import Venta from "../models/Venta.js";
import Moto from "../models/Moto.js";

export const crearVenta = async (req, res) => {
  try {
    const { motoId, cantidad = 1 } = req.body;

    // Verificar stock
    const moto = await Moto.findById(motoId);
    if (!moto) return res.status(404).json({ msg: "Moto no encontrada" });
    if (moto.stock < cantidad) return res.status(400).json({ msg: "Stock insuficiente" });

    const venta = await Venta.create({
      usuario: req.user.id,
      moto: motoId,
      cantidad
    });

    // Reducir stock
    moto.stock -= cantidad;
    await moto.save();

    res.json(venta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al crear venta" });
  }
};

export const getVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({ usuario: req.user.id })
      .populate("usuario")
      .populate("moto");
    res.json(ventas);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener ventas" });
  }
};