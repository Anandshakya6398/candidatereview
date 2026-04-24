const SummaryBar = ({ candidates }) => {
  const total       = candidates.length;
  const reviewed    = candidates.filter((c) => c.status === "reviewed").length;
  const shortlisted = candidates.filter((c) => c.status === "shortlisted").length;
  const pending     = candidates.filter((c) => c.status === "pending").length;

  const cards = [
    { label: "Total",       value: total,       color: "#4f46e5" },
    { label: "Reviewed",    value: reviewed,    color: "#0891b2" },
    { label: "Shortlisted", value: shortlisted, color: "#16a34a" },
    { label: "Pending",     value: pending,     color: "#d97706" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "14px 18px",
            borderTop: `3px solid ${c.color}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {c.label}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: c.color,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryBar;