import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import csv from "csv-parser";
import bcrypt from "bcryptjs"; 
import Usuario from "../models/Usuario.js";

dotenv.config();

const seedUsuarios = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo conectado");

    await Usuario.deleteMany();
    console.log("🧹 Usuarios eliminados");

    const usuarios = [];
    const emailsSet = new Set(); // evitar duplicados

    fs.createReadStream("src/data/usuarios.csv")
      .pipe(csv({ separator: "," }))
      .on("data", (row) => {
        const nombre = row.nombre?.trim();
        const email = row.email?.trim().toLowerCase();
        const password = row.password?.trim();

        // Validaciones
        if (!nombre || !email || !password) return;
        if (emailsSet.has(email)) return;

        emailsSet.add(email);

        usuarios.push({ nombre, email, password });
      })
      .on("end", async () => {
        console.log("🔐 Encriptando contraseñas...");

        const usuariosFinal = await Promise.all(
          usuarios.map(async (user) => ({
            nombre: user.nombre,
            email: user.email,
            password: await bcrypt.hash(user.password, 10),
            rol: "user"
          }))
        );

        await Usuario.insertMany(usuariosFinal, {
          ordered: false
        });

        console.log("✅ Usuarios insertados:", usuariosFinal.length);
        process.exit();
      });

  } catch (error) {
    console.error("❌ Error en seedUsuarios:", error);
    process.exit(1);
  }
};

seedUsuarios();