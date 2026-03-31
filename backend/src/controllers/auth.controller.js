import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await Usuario.create({
    nombre,
    email,
    password: hash
  });

  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Usuario.findOne({ email });

  if (!user) return res.status(404).json({ msg: "Usuario no existe" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({ msg: "Password incorrecto" });

  const token = jwt.sign(
    { id: user._id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};