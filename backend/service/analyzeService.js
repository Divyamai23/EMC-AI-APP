// Logic layer: read the PDF, persist the analysis. Scoring arrives with the AI part.
import mongoose from "mongoose";
// the package's main entry has a debug-mode bug under ESM, so import the lib file
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Resume from "../models/Resume.js";
import { cleanText } from "../utils.js";

export async function createAnalysis({ fileName, buffer, jdText }) {
  const pdf = await pdfParse(buffer);
  const doc = await Resume.create({
    fileName,
    resumeText: cleanText(pdf.text),
    jdText,
  });

  return {
    id: doc._id,
    fileName: doc.fileName,
    status: doc.status,
    resumeChars: doc.resumeText.length,
    note: "Score and skill comparison arrive when the AI part is added",
  };
}

export async function findAnalysis(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Resume.findById(id);
}
