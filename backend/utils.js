// Shared helpers used by more than one layer.

// Wraps an async controller so thrown errors flow into the error middleware
// instead of becoming unhandled rejections.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Collapses whitespace and trims text extracted from PDFs before storing it.
export function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}
