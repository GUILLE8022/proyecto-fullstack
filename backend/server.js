import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes.js";
import motoRoutes from "./src/routes/moto.routes.js";
import ventaRoutes from "./src/routes/venta.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/motos", motoRoutes);
app.use("/api/ventas", ventaRoutes);

// ruta de prueba (recomendado)
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// conexión DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.log(err));

// puerto correcto
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
