import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import csv from "csv-parser";
import Moto from "../models/Moto.js";

dotenv.config();

const seedMotos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo conectado");

    await Moto.deleteMany();
    console.log("🧹 Motos eliminadas");

    const motos = [];

    fs.createReadStream("src/data/motos.csv")
      .pipe(csv({ separator: "," }))
      .on("data", (row) => {
        const marca = row.marca?.trim();
        const modelo = Number(row.modelo);
        const precio = Number(row.precio);
        const cilindraje = Number(row.cilindraje);
        const stock = Number(row.stock);
        const imagen = row.imagen?.trim();
        const segmento = row.segmento?.trim();

        // 🚨 Validación fuerte
        if (
          !marca ||
          isNaN(modelo) ||
          isNaN(precio) ||
          isNaN(cilindraje)
        ) {
          console.log("❌ Fila inválida:", row);
          return;
        }

        motos.push({
          marca,
          modelo,
          precio,
          cilindraje,
          stock: isNaN(stock) ? 10 : stock,
          imagen,
          segmento
        });
      })
      .on("end", async () => {
        console.log("📦 Insertando motos...");

        await Moto.insertMany(motos, {
          ordered: false
        });

        console.log("✅ Motos insertadas:", motos.length);
        process.exit();
      });

  } catch (error) {
    console.error("❌ Error en seedMotos:", error);
    process.exit(1);
  }
};

seedMotos();