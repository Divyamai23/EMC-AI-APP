// Serverless entry for Vercel: same stack as server.js, but exports a handler
// instead of listening. server.js stays the entry for `npm run dev` locally.
import "dotenv/config";
import express from "express";
import cors from "cors";
import { loadEnv } from "../config/env.js";
import { connectDB } from "../config/db.js";
import analyzeRoutes from "../routes/analyze.js";
import { errorHandler } from "../middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", analyzeRoutes);
app.use(errorHandler);

// One Mongo connection per serverless container, memoized; if a cold start
// can't reach the DB, the next request retries instead of caching the failure.
let dbPromise;
function ensureDb(env) {
  dbPromise ??= connectDB(env.MONGO_URI).catch((err) => {
    dbPromise = undefined;
    throw err;
  });
  return dbPromise;
}

export default async function handler(req, res) {
  const env = loadEnv(); // throws a clear error if MONGO_URI is missing
  try {
    await ensureDb(env);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res.status(503).json({ error: "Database not reachable" });
    return;
  }
  app(req, res);
}
