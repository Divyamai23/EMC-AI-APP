// HTTP layer: validates the request shape, calls the service, sends JSON.
import { createAnalysis, findAnalysis } from "../service/analyzeService.js";
import { asyncHandler } from "../utils.js";

export const analyzeResume = asyncHandler(async (req, res) => {
  const jdText = (req.body.jd || "").trim();
  if (!jdText) {
    return res.status(400).json({ error: "Send the job description in the 'jd' field" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Send the PDF in the 'resume' field" });
  }

  const result = await createAnalysis({
    fileName: req.file.originalname,
    buffer: req.file.buffer,
    jdText,
  });

  res.status(201).json(result);
});

export const getAnalysis = asyncHandler(async (req, res) => {
  const doc = await findAnalysis(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: "No analysis with that id" });
  }
  res.json(doc);
});
