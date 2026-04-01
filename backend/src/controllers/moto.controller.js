import Moto from "../models/Moto.js";

export const getMotos = async (req, res) => {
  try {
    const motos = await Moto.find();
    res.json(motos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener motos" });
  }
};

export const getMotoById = async (req, res) => {
  try {
    const moto = await Moto.findById(req.params.id);
    if (!moto) return res.status(404).json({ msg: "Moto no encontrada" });
    res.json(moto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener moto" });
  }
};

export const crearMoto = async (req, res) => {
  try {
    const moto = await Moto.create(req.body);
    res.json(moto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al crear moto" });
  }
};

export const actualizarMoto = async (req, res) => {
  try {
    const moto = await Moto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!moto) return res.status(404).json({ msg: "Moto no encontrada" });
    res.json(moto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al actualizar moto" });
  }
};

export const eliminarMoto = async (req, res) => {
  try {
    const moto = await Moto.findByIdAndDelete(req.params.id);
    if (!moto) return res.status(404).json({ msg: "Moto no encontrada" });
    res.json({ msg: "Moto eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar moto" });
  }
};