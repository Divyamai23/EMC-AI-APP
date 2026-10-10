export default function SkillsGrid({ present, missing }) {
  return (
    <div className="skills-grid">
      <div className="skill-card">
        <h3>✅ Skills we found</h3>
        <div className="chips">
          {present.map((s) => (
            <Chip key={s} text={s} kind="present" />
          ))}
        </div>
      </div>
      <div className="skill-card">
        <h3>🎯 Skills missing</h3>
        <div className="chips">
          {missing.map((s) => (
            <Chip key={s} text={s} kind="missing" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ text, kind }) {
  return <span className={`chip ${kind}`}>{text}</span>;
}
