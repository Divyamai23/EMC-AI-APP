import { Router } from "express";
import multer from "multer";
// the package's main entry has a debug-mode bug under ESM, so import the lib file
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Resume from "../models/Resume.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true });
});

// POST /api/analyze — resume PDF + JD text; scoring arrives with the AI part
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Send the PDF in the 'resume' field" });
    }
    const jdText = (req.body.jd || "").trim();
    if (!jdText) {
      return res.status(400).json({ error: "Send the job description in the 'jd' field" });
    }

    const pdf = await pdfParse(req.file.buffer);
    const doc = await Resume.create({
      fileName: req.file.originalname,
      resumeText: pdf.text,
      jdText,
    });

    res.status(201).json({
      id: doc._id,
      fileName: doc.fileName,
      status: doc.status,
      resumeChars: pdf.text.length,
      note: "Score and skill comparison arrive when the AI part is added",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not read that PDF" });
  }
});

// GET /api/analyze/:id — stored analysis
router.get("/analyze/:id", async (req, res) => {
  try {
    const doc = await Resume.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "No analysis with that id" });
    res.json(doc);
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
