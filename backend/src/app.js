import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import motoRoutes from "./routes/moto.routes.js";
import ventaRoutes from "./routes/venta.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/motos", motoRoutes);
app.use("/api/ventas", ventaRoutes);

export default app;