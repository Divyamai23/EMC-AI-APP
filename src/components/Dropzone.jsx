import { useRef, useState } from "react";

export default function Dropzone({ onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={`dropzone${dragging ? " dragging" : ""}`}
      tabIndex={0}
      role="button"
      aria-label="Upload a resume PDF"
      onClick={() => inputRef.current.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          onFile(e.target.files[0]);
          e.target.value = ""; // allow picking the same file again
        }}
      />
      <div className="dz-icon">📄</div>
      <p className="dz-title">Drop your resume PDF here</p>
      <p className="dz-sub">
        or <span className="link">browse files</span> · PDF only
      </p>
    </div>
  );
}
