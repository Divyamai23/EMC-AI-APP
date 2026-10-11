import "dotenv/config";
import express from "express";
import cors from "cors";
import { loadEnv } from "./config/env.js";
import { connectDB } from "./config/db.js";
import analyzeRoutes from "./routes/analyze.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", analyzeRoutes);
app.use(errorHandler);

const env = loadEnv();

connectDB(env.MONGO_URI)
  .then(() => {
    app.listen(env.PORT, () =>
      console.log(`API listening on http://localhost:${env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
