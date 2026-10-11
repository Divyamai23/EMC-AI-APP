import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  resumeText: { type: String, required: true }, // text extracted from the PDF
  jdText: { type: String, required: true },     // job description for comparison
  score: { type: Number, default: null },       // filled in when the AI part lands
  status: { type: String, default: "pending" }, // pending | scored
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", resumeSchema);
