import { DEFAULT_FILTERS } from "../utils/filterSort";

const FilterPanel = ({ filters, setFilters }) => {
  const RangeFilter = ({ label, field }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          type="number"
          min={0}
          max={100}
          value={filters[field][0]}
          onChange={(e) =>
            setFilters((f) => ({ ...f, [field]: [+e.target.value, f[field][1]] }))
          }
          style={{
            width: 54,
            padding: "4px 6px",
            fontSize: 12,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            textAlign: "center",
          }}
        />
        <span style={{ fontSize: 11, color: "#9ca3af" }}>—</span>
        <input
          type="number"
          min={0}
          max={100}
          value={filters[field][1]}
          onChange={(e) =>
            setFilters((f) => ({ ...f, [field]: [f[field][0], +e.target.value] }))
          }
          style={{
            width: 54,
            padding: "4px 6px",
            fontSize: 12,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            textAlign: "center",
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#111827",
          marginBottom: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Filters
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          style={{
            fontSize: 11,
            color: "#4f46e5",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Reset
        </button>
      </div>

      <RangeFilter label="Assignment Score" field="assignmentRange" />
      <RangeFilter label="Video Score"      field="videoRange" />
      <RangeFilter label="ATS Score"        field="atsRange" />

      <div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>
          Status
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          style={{
            width: "100%",
            padding: "5px 8px",
            fontSize: 12,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            background: "#fff",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;