import multer from "multer";

// 5 MB cap, memory storage, PDFs only. Filter rejections are marked with a
// statusCode so the error handler can send them as 400s, not 500s.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    if (isPdf) return cb(null, true);
    cb(Object.assign(new Error("Only PDF files are accepted"), { statusCode: 400 }));
  },
});
