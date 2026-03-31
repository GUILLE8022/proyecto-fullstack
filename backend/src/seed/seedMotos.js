import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import Moto from "../src/models/Moto.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const results = [];

fs.createReadStream("data/motos.csv")
  .pipe(csv())
  .on("data", (data) => {
    data.precio = Number(data.precio);
    data.cilindraje = Number(data.cilindraje);
    results.push(data);
  })
  .on("end", async () => {
    await Moto.insertMany(results);
    console.log("✅ Motos insertadas");
    process.exit();
  });