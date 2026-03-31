import Moto from "../models/Moto.js";

export const getMotos = async (req, res) => {
  const motos = await Moto.find();
  res.json(motos);
};

export const getMotoById = async (req, res) => {
  const moto = await Moto.findById(req.params.id);
  res.json(moto);
};

export const crearMoto = async (req, res) => {
  const moto = await Moto.create(req.body);
  res.json(moto);
};

export const actualizarMoto = async (req, res) => {
  const moto = await Moto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(moto);
};

export const eliminarMoto = async (req, res) => {
  await Moto.findByIdAndDelete(req.params.id);
  res.json({ msg: "Moto eliminada" });
};