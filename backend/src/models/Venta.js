import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema(
  {
    comprador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null
    },
    compradorNombre: {
      type: String,
      default: ""
    },
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El vendedor es obligatorio"]
    },
    moto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moto",
      required: [true, "La moto es obligatoria"]
    },
    cantidad: {
      type: Number,
      default: 1,
      min: 1
    },
    precioTotal: {
      type: Number,
      required: [true, "El precio total es obligatorio"],
      min: 0
    },
    tipo: {
      type: String,
      enum: ["marketplace", "directa"],
      default: "marketplace"
    },
    estado: {
      type: String,
      enum: ["pendiente", "completada", "cancelada"],
      default: "completada"
    },
    nota: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Venta", ventaSchema);
