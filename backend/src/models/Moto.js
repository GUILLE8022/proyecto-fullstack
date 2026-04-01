import mongoose from "mongoose";

const motoSchema = new mongoose.Schema({
  marca: String,
  modelo: String,
  precio: Number,
  cilindraje: Number,
  stock: { type: Number, default: 10 },
  imagen: String,
  segmento: { type: String, default: "General" }
});

export default mongoose.model("Moto", motoSchema);