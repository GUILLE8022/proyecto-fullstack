import mongoose from "mongoose";

const motoSchema = new mongoose.Schema({
  marca: String,
  modelo: String,
  precio: Number,
  cilindraje: Number,
  imagen: String
});

export default mongoose.model("Moto", motoSchema);