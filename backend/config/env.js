// Central place for reading environment config, validated on boot.
export function loadEnv() {
  const MONGO_URI = process.env.MONGO_URI;
  const PORT = process.env.PORT || 4000;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set — add it to backend/.env");
  }

  return { MONGO_URI, PORT };
}
