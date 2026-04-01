import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const results = [];

fs.createReadStream("data/usuarios.csv")
  .pipe(csv())
  .on("data", (data) => {
    results.push(data);
  })
  .on("end", async () => {
    for (const user of results) {
      const hash = await bcrypt.hash(user.password, 10);
      await Usuario.create({
        nombre: user.nombre,
        email: user.email,
        password: hash
      });
    }
    console.log("✅ Usuarios insertados");
    process.exit();
  });