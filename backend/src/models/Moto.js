import mongoose from "mongoose";

const motoSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, "La marca es obligatoria"],
      trim: true
    },
    modelo: {
      type: String,
      required: [true, "El modelo es obligatorio"],
      trim: true
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: 0
    },
    cilindraje: {
      type: Number,
      required: [true, "El cilindraje es obligatorio"],
      min: 0
    },
    stock: {
      type: Number,
      default: 1,
      min: 0
    },
    imagen: {
      type: String,
      default: "https://via.placeholder.com/400x300?text=Moto"
    },
    descripcion: {
      type: String,
      default: ""
    },
    segmento: {
      type: String,
      default: "General"
    },
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "La moto debe tener un propietario"]
    },
    enVenta: {
      type: Boolean,
      default: false
    },
    disponible: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Moto", motoSchema);
