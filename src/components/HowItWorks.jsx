const STEPS = [
  { num: 1, title: "Upload", text: "Drop the PDF you'd actually send out. Nothing leaves your browser." },
  { num: 2, title: "Parse", text: "The parser extracts your text and matches it against the skills recruiters scan for." },
  { num: 3, title: "Score", text: "Get a 0–100 score, the skills it found, and the gaps worth closing." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="how">
      <div className="container">
        <h2>How it works</h2>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.num}>
              <span className="step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
