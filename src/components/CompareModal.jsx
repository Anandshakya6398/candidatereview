import { PriorityBadge } from "./SharedUI";

const COMPARE_FIELDS = [
  { label: "Assignment",    key: "assignment_score",    color: "#4f46e5" },
  { label: "Video",         key: "video_score",         color: "#0891b2" },
  { label: "ATS",           key: "ats_score",           color: "#16a34a" },
  { label: "GitHub",        key: "github_score",        color: "#d97706" },
  { label: "Communication", key: "communication_score", color: "#db2777" },
  { label: "Priority Score",key: "priority_score",      color: "#7c3aed" },
];

const CompareModal = ({ candidates, onClose }) => (
  <div
    style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
  >
    <div
      style={{
        background: "#fff", borderRadius: 14, padding: 28,
        width: 760, maxWidth: "95vw", maxHeight: "85vh", overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>Candidate Comparison</div>
        <button
          onClick={onClose}
          style={{ background: "#f3f4f6", border: "none", borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 18 }}
        >
          ×
        </button>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `160px ${candidates.map(() => "1fr").join(" ")}`,
          gap: 12,
        }}
      >
        {/* Empty top-left cell */}
        <div />

        {/* Candidate name headers */}
        {candidates.map((c) => (
          <div
            key={c.id}
            style={{ textAlign: "center", padding: "10px 8px", background: "#f9fafb", borderRadius: 8 }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{c.college}</div>
            <div style={{ marginTop: 6 }}>
              <PriorityBadge score={c.priority_score} small />
            </div>
          </div>
        ))}

        {/* Score rows */}
        {COMPARE_FIELDS.map((f) => (
          <>
            <div
              key={f.label}
              style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#6b7280", fontWeight: 600 }}
            >
              {f.label}
            </div>
            {candidates.map((c) => {
              const max   = Math.max(...candidates.map((x) => x[f.key]));
              const isMax = c[f.key] === max;
              return (
                <div
                  key={c.id}
                  style={{
                    padding: "10px 8px", textAlign: "center",
                    background: isMax ? "#f0fdf4" : "#fff",
                    border: `1px solid ${isMax ? "#bbf7d0" : "#f3f4f6"}`,
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, color: f.color }}>{c[f.key]}</div>
                  <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ width: `${c[f.key]}%`, height: "100%", background: f.color, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  </div>
);

export default CompareModal;