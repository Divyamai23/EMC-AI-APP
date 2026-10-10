import { useEffect, useRef, useState } from "react";
import Dropzone from "./Dropzone.jsx";
import ScoreCard from "./ScoreCard.jsx";
import SkillsGrid from "./SkillsGrid.jsx";
import { SKILLS, mockResult } from "../lib/mockParser.js";

// Fake parse choreography: what label shows at what progress %.
const PARSE_STEPS = [
  ["Reading PDF…", 30],
  ["Extracting text…", 60],
  ["Matching skills…", 85],
  ["Scoring…", 100],
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPdf = (file) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

export default function UploadSection() {
  const [status, setStatus] = useState("idle"); // idle | parsing | done
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState({ pct: 0, label: "" });
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Bumping this cancels any in-flight parse.
  const runRef = useRef(0);
  const topRef = useRef(null);

  // Stop the browser from opening the PDF if it's dropped outside the dropzone.
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  async function handleFile(file) {
    if (!file || status === "parsing") return;

    if (!isPdf(file)) {
      setError("That doesn't look like a PDF. Upload a .pdf resume and try again.");
      return;
    }

    setError("");
    setResult(null);
    setFileName(file.name);
    setStatus("parsing");

    const run = ++runRef.current;

    for (const [label, pct] of PARSE_STEPS) {
      await delay(350);
      if (runRef.current !== run) return; // cancelled
      setProgress({ pct, label });
    }

    await delay(600);
    if (runRef.current !== run) return; // cancelled

    setResult(mockResult(file));
    setStatus("done");
  }

  function reset() {
    runRef.current++; // cancel any in-flight parse
    setStatus("idle");
    setResult(null);
    setError("");
    setProgress({ pct: 0, label: "" });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section id="upload" className="upload">
      <div className="container narrow" ref={topRef}>
        <Dropzone onFile={handleFile} />

        {status === "parsing" && (
          <div className="status" aria-live="polite">
            <p className="file-name">{fileName}</p>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${progress.pct}%` }} />
            </div>
            <p className="progress-label">{progress.label}</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {result && (
          <section className="results">
            <ScoreCard
              score={result.score}
              matchedCount={result.present.length}
              totalCount={SKILLS.length}
            />
            <SkillsGrid present={result.present} missing={result.missing} />
            <div className="results-actions">
              <button className="btn" onClick={reset}>
                Score another resume
              </button>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
