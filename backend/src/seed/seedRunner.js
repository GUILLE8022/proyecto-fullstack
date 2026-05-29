import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import { readCsv } from "./utils/readCsv.js";
import Usuario from "../models/Usuario.js";
import Moto from "../models/Moto.js";
import Venta from "../models/Venta.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

const ADMIN_EMAIL = "admin@motostore.com";

const motoKey = (marca, modelo, precio, cilindraje, propietarioId) =>
  `${marca}|${modelo}|${precio}|${cilindraje}|${propietarioId}`;

export async function runSeed({ mode = "full" } = {}) {
  const isFull = mode === "full";

  if (isFull) {
    await Venta.deleteMany();
    await Moto.deleteMany();
    await Usuario.deleteMany();
    console.log("🧹 Base de datos limpiada (modo completo)");
  } else {
    console.log("➕ Modo incremental — no se borran datos existentes");
  }

  const usuariosRows = await readCsv(path.join(DATA_DIR, "usuarios.csv"));
  const motosRows = await readCsv(path.join(DATA_DIR, "motos.csv"));

  let usuariosNuevos = 0;
  let usuariosOmitidos = 0;
  const usuarios = await Usuario.find();
  const usuariosMap = new Map(usuarios.map((u) => [u.email, u]));

  for (const row of usuariosRows) {
    const nombre = row.nombre?.trim();
    const email = row.email?.trim().toLowerCase();
    const password = row.password?.trim();

    if (!nombre || !email || !password) continue;

    if (usuariosMap.has(email)) {
      usuariosOmitidos++;
      continue;
    }

    const nuevo = await Usuario.create({
      nombre,
      email,
      password: await bcrypt.hash(password, 10),
      rol: "user",
      activo: true
    });

    usuariosMap.set(email, nuevo);
    usuariosNuevos++;
  }

  if (!usuariosMap.has(ADMIN_EMAIL)) {
    await Usuario.create({
      nombre: "Admin MotoStore",
      email: ADMIN_EMAIL,
      password: await bcrypt.hash("admin123", 10),
      rol: "admin",
      activo: true
    });
    usuariosNuevos++;
    console.log("✅ Admin creado: admin@motostore.com / admin123");
  } else if (!isFull) {
    console.log("ℹ️ Admin ya existe — omitido");
  }

  const todosUsuarios = await Usuario.find();
  console.log(
    `👤 Usuarios: +${usuariosNuevos} nuevos, ${usuariosOmitidos} omitidos (ya existían). Total: ${todosUsuarios.length}`
  );

  const motosExistentes = await Moto.find().select("marca modelo precio cilindraje propietario");
  const motosKeys = new Set(
    motosExistentes.map((m) =>
      motoKey(m.marca, m.modelo, m.precio, m.cilindraje, m.propietario.toString())
    )
  );

  let motosNuevas = 0;
  let motosOmitidas = 0;
  let userIndex = todosUsuarios.length > 0 ? (await Moto.countDocuments()) % todosUsuarios.length : 0;

  for (const row of motosRows) {
    const marca = row.marca?.trim();
    const modelo = String(row.modelo ?? "").trim();
    const precio = Number(row.precio);
    const cilindraje = Number(row.cilindraje);
    const stock = Number(row.stock);
    const imagen = row.imagen?.trim();
    const segmento = row.segmento?.trim() || "General";
    const emailPropietario = row.email_propietario?.trim().toLowerCase();

    if (!marca || !modelo || Number.isNaN(precio) || Number.isNaN(cilindraje)) {
      console.log("⚠️ Fila moto omitida (datos inválidos):", row);
      continue;
    }

    let propietario;
    if (emailPropietario && usuariosMap.has(emailPropietario)) {
      propietario = usuariosMap.get(emailPropietario);
    } else {
      propietario = todosUsuarios[userIndex % todosUsuarios.length];
      userIndex++;
    }

    if (!propietario) continue;

    const key = motoKey(marca, modelo, precio, cilindraje, propietario._id.toString());
    if (motosKeys.has(key)) {
      motosOmitidas++;
      continue;
    }

    const enVenta = row.en_venta !== undefined
      ? row.en_venta === "true" || row.en_venta === "1"
      : userIndex % 3 !== 0;

    await Moto.create({
      marca,
      modelo,
      precio,
      cilindraje,
      stock: Number.isNaN(stock) ? 1 : stock,
      imagen: imagen || "https://via.placeholder.com/400x300?text=Moto",
      segmento,
      propietario: propietario._id,
      enVenta,
      disponible: true,
      descripcion: row.descripcion?.trim() || `${marca} ${modelo} - ${segmento}`
    });

    motosKeys.add(key);
    motosNuevas++;
  }

  console.log(`🏍️ Motos: +${motosNuevas} nuevas, ${motosOmitidas} omitidas (duplicadas). Total: ${await Moto.countDocuments()}`);

  let ventasCreadas = 0;
  if (isFull) {
    const motosEnVenta = await Moto.find({ enVenta: true, disponible: true }).limit(5);
    for (const moto of motosEnVenta) {
      const comprador = todosUsuarios.find(
        (u) => u._id.toString() !== moto.propietario.toString() && u.rol === "user"
      );
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
    console.log(`📜 Ventas de ejemplo: ${ventasCreadas} (solo en modo completo)`);
  }

  console.log("\n📋 Credenciales de prueba:");
  console.log("   Admin → admin@motostore.com / admin123");
  console.log("   User  → juanp@gmail.com / juan321");
  console.log(`\n🎉 Seed ${isFull ? "completo" : "incremental"} finalizado`);
}
