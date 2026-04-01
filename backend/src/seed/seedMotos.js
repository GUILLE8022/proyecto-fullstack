import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import Moto from "../models/Moto.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const results = [];

fs.createReadStream("data/motos.csv")
  .pipe(csv())
  .on("data", (data) => {
    data.precio = Number(data.precio);
    data.cilindraje = Number(data.cilindraje);
    data.stock = Number(data.stock || 10);
    results.push(data);
  })
  .on("end", async () => {
    await Moto.insertMany(results);
    console.log("✅ Motos insertadas");
    process.exit();
  });