import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/auth.routes.v2.js";
import motoRoutes from "./src/routes/moto.routes.v2.js";
import ventaRoutes from "./src/routes/venta.routes.v2.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { corsOptions } from "./src/config/cors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/motos", motoRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend funcionando", data: { status: "ok" } });
});

// 404 API — ruta explícita para depuración
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada"
  });
});

app.use(errorHandler);

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI no está definida en .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET no está definida en .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Error MongoDB:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
