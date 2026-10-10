import { useEffect, useState } from "react";
import { verdictFor } from "../lib/mockParser.js";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreCard({ score, matchedCount, totalCount }) {
  const [offset, setOffset] = useState(CIRCUMFERENCE); // ring starts empty
  const [shown, setShown] = useState(0);

  // Fill the ring: the first paint renders the empty ring, then this effect
  // sets the target offset so the CSS transition actually animates.
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setOffset(CIRCUMFERENCE * (1 - score / 100))
    );
    return () => cancelAnimationFrame(raf);
  }, [score]);

  // Count the number up over ~0.9s with an ease-out curve.
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 900;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(score * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const band = score >= 70 ? "good" : score >= 55 ? "mid" : "low";

  return (
    <div className="score-card">
      <div className="ring-wrap">
        <svg className="ring" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="ring-track" cx="60" cy="60" r={RADIUS} />
          <circle
            className={`ring-fill ${band}`}
            cx="60"
            cy="60"
            r={RADIUS}
            transform="rotate(-90 60 60)"
            style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: offset }}
          />
        </svg>
        <div className="score-num">
          <span>{shown}</span>
          <span className="score-outof">/100</span>
        </div>
      </div>
      <div className="score-copy">
        <h2 className="verdict">{verdictFor(score)}</h2>
        <p className="muted">
          Matched {matchedCount} of {totalCount} skills recruiters scan for
        </p>
        <p className="disclaimer">Mock score — demo data, no real parsing yet.</p>
      </div>
    </div>
  );
}
