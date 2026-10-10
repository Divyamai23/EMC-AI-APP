// Mock scoring engine — no backend.
// Results are generated from a seed made from the file's name + size,
// so the same file always scores the same (makes the demo feel consistent).

const SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Git", "Docker", "AWS", "REST APIs", "CSS", "CI/CD", "MongoDB", "Testing",
];

const PARSE_STEPS = [
  ["Reading PDF…", 30],
  ["Extracting text…", 60],
  ["Matching skills…", 85],
  ["Scoring…", 100],
];

const els = {
  dropzone: document.getElementById("dropzone"),
  input: document.getElementById("file-input"),
  status: document.getElementById("status"),
  fileName: document.getElementById("file-name"),
  bar: document.getElementById("progress-bar"),
  progressLabel: document.getElementById("progress-label"),
  error: document.getElementById("error"),
  results: document.getElementById("results"),
  ring: document.getElementById("ring-fill"),
  scoreValue: document.getElementById("score-value"),
  verdict: document.getElementById("score-verdict"),
  matchedLine: document.getElementById("matched-line"),
  present: document.getElementById("present-skills"),
  missing: document.getElementById("missing-skills"),
  reset: document.getElementById("reset"),
};

let parsing = false;
let parseTimers = [];

// ---------- upload wiring ----------

els.dropzone.addEventListener("click", () => els.input.click());
els.dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    els.input.click();
  }
});
els.input.addEventListener("change", () => handleFile(els.input.files[0]));

els.dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  els.dropzone.classList.add("dragging");
});
els.dropzone.addEventListener("dragleave", () => els.dropzone.classList.remove("dragging"));
els.dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  els.dropzone.classList.remove("dragging");
  handleFile(e.dataTransfer.files[0]);
});

// stop the browser from opening the PDF if it's dropped outside the dropzone
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());

els.reset.addEventListener("click", reset);

function handleFile(file) {
  if (!file || parsing) return;

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    showError("That doesn't look like a PDF. Upload a .pdf resume and try again.");
    return;
  }
  clearError();
  parsing = true;
  els.results.hidden = true;

  // fake parse: step through the progress bar, then show mock results
  els.status.hidden = false;
  els.fileName.textContent = file.name;
  els.bar.style.width = "0%";

  PARSE_STEPS.forEach(([label, pct], i) => {
    parseTimers.push(
      setTimeout(() => {
        els.progressLabel.textContent = label;
        els.bar.style.width = pct + "%";
      }, 350 * (i + 1))
    );
  });

  parseTimers.push(
    setTimeout(() => {
      parsing = false;
      els.status.hidden = true;
      renderResult(mockResult(file));
    }, 350 * (PARSE_STEPS.length + 1) + 250)
  );
}

function reset() {
  parseTimers.forEach(clearTimeout);
  parseTimers = [];
  parsing = false;
  els.input.value = ""; // so picking the same file again re-fires "change"
  els.results.hidden = true;
  els.status.hidden = true;
  els.dropzone.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ---------- mock data ----------

// FNV-1a: small, fast string hash — good enough to seed a PRNG.
function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32: tiny seeded PRNG, so the same seed always gives the same result.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mockResult(file) {
  const rand = mulberry32(hashString(file.name + ":" + file.size));

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

function verdictFor(score) {
  if (score >= 85) return "Shipped-ready — recruiters will shortlist this.";
  if (score >= 70) return "Strong signal — a few skills away from top tier.";
  if (score >= 55) return "Getting there — surface more of your stack.";
  return "Needs work — the parser barely found your skills.";
}

// ---------- rendering ----------

function renderResult({ score, present, missing }) {
  els.results.hidden = false;

  // animate the score ring (r = 52 → circumference ≈ 326.7)
  const C = 2 * Math.PI * 52;
  els.ring.style.strokeDasharray = C;
  els.ring.style.strokeDashoffset = C; // start empty
  requestAnimationFrame(() => {
    els.ring.style.strokeDashoffset = C * (1 - score / 100);
  });

  const band = score >= 70 ? "good" : score >= 55 ? "mid" : "low";
  els.ring.classList.remove("good", "mid", "low");
  els.ring.classList.add(band);

  animateCount(score);
  els.verdict.textContent = verdictFor(score);
  els.matchedLine.textContent = `Matched ${present.length} of ${SKILLS.length} skills recruiters scan for`;

  els.present.replaceChildren(...present.map((s) => chip(s, "present")));
  els.missing.replaceChildren(...missing.map((s) => chip(s, "missing")));
}

function animateCount(target) {
  const start = performance.now();
  const dur = 900;
  function tick(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    els.scoreValue.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function chip(text, kind) {
  const span = document.createElement("span");
  span.className = "chip " + kind;
  span.textContent = text;
  return span;
}

function showError(msg) {
  els.error.textContent = msg;
  els.error.hidden = false;
}

function clearError() {
  els.error.hidden = true;
}
