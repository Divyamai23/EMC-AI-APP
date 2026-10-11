import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRoutes from "./src/routes/analyze.js";
import { connectDB } from "./src/db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", analyzeRoutes);

// turn multer errors (e.g. PDF over the limit) into JSON
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "PDF is over the 5 MB limit" });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`API listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
