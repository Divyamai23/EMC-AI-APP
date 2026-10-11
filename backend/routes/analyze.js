// HTTP endpoints only: declare the route, wire middleware order, hand off to controllers.
import { Router } from "express";
import { analyzeResume, getAnalysis } from "../controller/analyzeController.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true });
});

router.post("/analyze", upload.single("resume"), analyzeResume);
router.get("/analyze/:id", getAnalysis);

export default router;
