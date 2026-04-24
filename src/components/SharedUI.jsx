import { getPriorityLabel } from "../utils/priority";
import { PRIORITY_STYLES } from "../data/constants";

export const PriorityBadge = ({ score, small }) => {
  const label = getPriorityLabel(score);
  const s = PRIORITY_STYLES[label];
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        padding: small ? "2px 7px" : "3px 10px",
        borderRadius: 4,
        fontSize: small ? 11 : 12,
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: 0.5,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

export const ScoreBar = ({ value, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        flex: 1,
        height: 6,
        background: "#e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
          transition: "width 0.3s",
        }}
      />
    </div>
    <span
      style={{
        fontSize: 12,
        minWidth: 28,
        textAlign: "right",
        color: "#374151",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </span>
  </div>
);

export const Slider = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 12 }}>
    <div
      style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}
    >
      <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
        {value}
        <span style={{ color: "#9ca3af" }}>/100</span>
      </span>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      step={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: "#4f46e5" }}
    />
  </div>
);

export const StarRating = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 10 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
      <div style={{ display: "flex", gap: 3 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              color: n <= value ? "#f59e0b" : "#d1d5db",
              padding: "0 1px",
              transition: "color 0.1s",
            }}
          >
            ★
          </button>
        ))}
        <span
          style={{
            fontSize: 12,
            color: "#9ca3af",
            marginLeft: 4,
            alignSelf: "center",
          }}
        >
          {value}/5
        </span>
      </div>
    </div>
  </div>
);