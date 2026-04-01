import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  moto: { type: mongoose.Schema.Types.ObjectId, ref: "Moto" },
  cantidad: { type: Number, default: 1 },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Venta", ventaSchema);