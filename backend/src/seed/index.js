import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { readCsv } from "./utils/readCsv.js";
import Usuario from "../models/Usuario.js";
import Moto from "../models/Moto.js";
import Venta from "../models/Venta.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI no definida en .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");

    await Venta.deleteMany();
    await Moto.deleteMany();
    await Usuario.deleteMany();
    console.log("🧹 Base de datos limpiada");

    const usuariosRows = await readCsv(path.join(DATA_DIR, "usuarios.csv"));
    const motosRows = await readCsv(path.join(DATA_DIR, "motos.csv"));

    const emailsSet = new Set();
    const usuariosDocs = [];

    for (const row of usuariosRows) {
      const nombre = row.nombre?.trim();
      const email = row.email?.trim().toLowerCase();
      const password = row.password?.trim();

      if (!nombre || !email || !password) continue;
      if (emailsSet.has(email)) continue;
      emailsSet.add(email);

      usuariosDocs.push({
        nombre,
        email,
        password: await bcrypt.hash(password, 10),
        rol: "user",
        activo: true
      });
    }

    const adminPassword = await bcrypt.hash("admin123", 10);
    usuariosDocs.push({
      nombre: "Admin MotoStore",
      email: "admin@motostore.com",
      password: adminPassword,
      rol: "admin",
      activo: true
    });

    const usuarios = await Usuario.insertMany(usuariosDocs);
    console.log(`✅ Usuarios importados: ${usuarios.length}`);

    const motosDocs = [];
    let userIndex = 0;

    for (const row of motosRows) {
      const marca = row.marca?.trim();
      const modelo = String(row.modelo ?? "").trim();
      const precio = Number(row.precio);
      const cilindraje = Number(row.cilindraje);
      const stock = Number(row.stock);
      const imagen = row.imagen?.trim();
      const segmento = row.segmento?.trim() || "General";

      if (!marca || !modelo || Number.isNaN(precio) || Number.isNaN(cilindraje)) {
        console.log("⚠️ Fila omitida (datos inválidos):", row);
        continue;
      }

      const propietario = usuarios[userIndex % usuarios.length]._id;
      userIndex++;

      const enVenta = userIndex % 3 !== 0;

      motosDocs.push({
        marca,
        modelo,
        precio,
        cilindraje,
        stock: Number.isNaN(stock) ? 1 : stock,
        imagen: imagen || "https://via.placeholder.com/400x300?text=Moto",
        segmento,
        propietario,
        enVenta,
        disponible: true,
        descripcion: `${marca} ${modelo} - ${segmento}`
      });
    }

    const motos = await Moto.insertMany(motosDocs);
    console.log(`✅ Motos importadas: ${motos.length}`);

    const motosEnVenta = motos.filter((m) => m.enVenta);
    let ventasCreadas = 0;

    for (let i = 0; i < Math.min(5, motosEnVenta.length); i++) {
      const moto = motosEnVenta[i];
      const comprador = usuarios.find((u) => u._id.toString() !== moto.propietario.toString());
      if (!comprador) continue;

      await Venta.create({
        comprador: comprador._id,
        compradorNombre: comprador.nombre,
        vendedor: moto.propietario,
        moto: moto._id,
        cantidad: 1,
        precioTotal: moto.precio,
        tipo: "marketplace",
        estado: "completada"
      });

      moto.disponible = false;
      moto.enVenta = false;
      await moto.save();
      ventasCreadas++;
    }

    console.log(`✅ Ventas de ejemplo creadas: ${ventasCreadas}`);
    console.log("\n📋 Credenciales de prueba:");
    console.log("   Admin → admin@motostore.com / admin123");
    console.log("   User  → juanp@gmail.com / juan321 (primer usuario del CSV)");
    console.log("\n🎉 Seed completado");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error.message);
    process.exit(1);
  }
};

seed();
