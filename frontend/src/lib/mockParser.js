// Mock scoring engine — no backend.
// Results are seeded from the file's name + size (FNV-1a hash → mulberry32
// PRNG), so the same file always produces the same score. When a real parser
// exists, replace mockResult and nothing above it needs to change.

export const SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Git", "Docker", "AWS", "REST APIs", "CSS", "CI/CD", "MongoDB", "Testing",
];

// FNV-1a: small, fast string hash — good enough to seed a PRNG.
export function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32: tiny seeded PRNG — same seed, same sequence.
export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mockResult(file) {
  const rand = mulberry32(hashString(`${file.name}:${file.size}`));

  // Fisher–Yates shuffle of the skill pool
  const pool = [...SKILLS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const presentCount = 7 + Math.floor(rand() * 5); // 7–11 of 14
  const present = pool.slice(0, presentCount).sort();
  const missing = pool.slice(presentCount).sort();

  const score = Math.min(
    100,
    Math.round(35 + (presentCount / SKILLS.length) * 60 + (rand() * 6 - 3))
  );

  return { score, present, missing };
}

export function verdictFor(score) {
  if (score >= 85) return "Shipped-ready — recruiters will shortlist this.";
  if (score >= 70) return "Strong signal — a few skills away from top tier.";
  if (score >= 55) return "Getting there — surface more of your stack.";
  return "Needs work — the parser barely found your skills.";
}
