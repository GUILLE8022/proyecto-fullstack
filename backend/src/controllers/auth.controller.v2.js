import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateEmail, validatePassword } from "../validators/validations.js";
import { ApiResponse, ApiError, asyncHandler } from "../utils/ApiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    throw new ApiError(400, "Todos los campos son obligatorios");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Email inválido");
  }

  if (!validatePassword(password)) {
    throw new ApiError(400, "La contraseña debe tener mínimo 6 caracteres");
  }

  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    throw new ApiError(400, "El email ya está registrado");
  }

  const hash = await bcrypt.hash(password, 10);

  const usuario = await Usuario.create({
    nombre,
    email,
    password: hash,
    rol: "user"
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      },
      "Usuario registrado correctamente"
    )
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email y contraseña requeridos");
  }

  const usuario = await Usuario.findOne({ email }).select("+password");
  if (!usuario) {
    throw new ApiError(401, "Credenciales incorrectas");
  }

  if (!usuario.activo) {
    throw new ApiError(401, "Usuario desactivado");
  }

  const esValida = await bcrypt.compare(password, usuario.password);
  if (!esValida) {
    throw new ApiError(401, "Credenciales incorrectas");
  }

  const token = jwt.sign(
    { id: usuario._id, email: usuario.email, role: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      },
      "Inicio de sesión exitoso"
    )
  );
});

export const getProfile = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findById(req.user.id).select("-password");

  if (!usuario) {
    throw new ApiError(404, "Usuario no encontrado");
  }

  res.status(200).json(new ApiResponse(200, usuario, "Perfil obtenido"));
});

export const getAllUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await Usuario.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, usuarios, "Usuarios obtenidos"));
});

export const toggleUsuarioActivo = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);

  if (!usuario) {
    throw new ApiError(404, "Usuario no encontrado");
  }

  if (usuario.rol === "admin") {
    throw new ApiError(400, "No se puede desactivar un administrador");
  }

  usuario.activo = !usuario.activo;
  await usuario.save();

  res.status(200).json(
    new ApiResponse(200, { id: usuario._id, activo: usuario.activo }, "Estado de usuario actualizado")
  );
});
