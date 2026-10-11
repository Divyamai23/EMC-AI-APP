// Single error handler for the whole API: multer limits, filter rejections
// marked with a statusCode, then the catch-all.
export function errorHandler(err, req, res, next) {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "PDF is over the 5 MB limit" });
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ error: "Send the PDF in the 'resume' field" });
  }
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
}
