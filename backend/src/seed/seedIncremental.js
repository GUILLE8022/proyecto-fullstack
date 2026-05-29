import mongoose from "mongoose";
import dotenv from "dotenv";
import { runSeed } from "./seedRunner.js";

dotenv.config();

const seedIncremental = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI no definida en .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");

    await runSeed({ mode: "incremental" });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed incremental:", error.message);
    process.exit(1);
  }
};

seedIncremental();
