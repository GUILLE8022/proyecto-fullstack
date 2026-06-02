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
import { corsOptions, corsPreflight } from "./src/config/cors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// En producción (Render) usa solo variables del dashboard, no el .env del repo
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error("❌ Faltan variables de entorno:", missingEnv.join(", "));
  console.error("   En Render/Railway: agrega MONGO_URI y JWT_SECRET en Environment Variables");
  process.exit(1);
}

const app = express();

// CORS manual primero (preflight OPTIONS) + cors package
app.use(corsPreflight);
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

const PORT = process.env.PORT || 3000;

// Escuchar ANTES de conectar Mongo (Railway healthcheck necesita respuesta rápida)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`🌐 CORS FRONTEND_URL: ${process.env.FRONTEND_URL || "(auto: *.vercel.app)"}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Error MongoDB:", err.message);
    // No exit — el servidor sigue vivo para mostrar errores en logs
  });
