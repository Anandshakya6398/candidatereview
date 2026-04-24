import { PRIORITY_STYLES, STATUS_COLORS, PAGE_SIZE } from "../data/constants";
import { getPriorityLabel } from "../utils/priority";

const CandidateTable = ({
  filtered,
  paginated,
  page,
  setPage,
  totalPages,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  compareSet,
  toggleCompare,
  onSelect,
}) => {
  const SortBtn = ({ field, label }) => (
    <button
      onClick={() => {
        if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortBy(field); setSortDir("desc"); }
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        color: sortBy === field ? "#4f46e5" : "#9ca3af",
        display: "flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      {label}
      {sortBy === field ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", width: 30 }} />
              <th style={{ padding: "10px 14px", textAlign: "left" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Candidate
                </span>
              </th>
              <th style={{ padding: "10px 10px", textAlign: "center" }}><SortBtn field="assignment" label="Assign" /></th>
              <th style={{ padding: "10px 10px", textAlign: "center" }}><SortBtn field="video"      label="Video"  /></th>
              <th style={{ padding: "10px 10px", textAlign: "center" }}><SortBtn field="ats"        label="ATS"    /></th>
              <th style={{ padding: "10px 10px", textAlign: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af" }}>GitHub</span>
              </th>
              <th style={{ padding: "10px 10px", textAlign: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af" }}>Comm</span>
              </th>
              <th style={{ padding: "10px 14px", textAlign: "center" }}><SortBtn field="priority" label="Priority" /></th>
              <th style={{ padding: "10px 14px", textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Status
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c, idx) => {
              const prio = getPriorityLabel(c.priority_score);
              const ps   = PRIORITY_STYLES[prio];
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c)}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    cursor: "pointer",
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ede9fe")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")
                  }
                >
                  {/* Checkbox */}
                  <td
                    style={{ padding: "9px 14px 9px 10px" }}
                    onClick={(e) => { e.stopPropagation(); toggleCompare(c.id); }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: `2px solid ${compareSet.has(c.id) ? "#4f46e5" : "#d1d5db"}`,
                        background: compareSet.has(c.id) ? "#4f46e5" : "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {compareSet.has(c.id) && (
                        <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>
                      )}
                    </div>
                  </td>

                  {/* Name / College */}
                  <td style={{ padding: "9px 14px" }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{c.college}</div>
                  </td>

                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 600, color: "#4f46e5"  }}>{c.assignment_score}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 600, color: "#0891b2"  }}>{c.video_score}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 600, color: "#16a34a"  }}>{c.ats_score}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 600, color: "#d97706"  }}>{c.github_score}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 600, color: "#db2777"  }}>{c.communication_score}</td>

                  {/* Priority */}
                  <td style={{ padding: "9px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <span style={{ background: ps.bg, color: ps.text, padding: "2px 9px", borderRadius: 4, fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}>
                        {prio}
                      </span>
                      <span style={{ fontSize: 10, color: "#9ca3af" }}>{c.priority_score}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "9px 14px", textAlign: "center" }}>
                    <span
                      style={{
                        background: `${STATUS_COLORS[c.status]}18`,
                        color: STATUS_COLORS[c.status],
                        padding: "3px 9px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
          {filtered.length} candidates
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "5px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              background: "#fff",
              cursor: page === 1 ? "not-allowed" : "pointer",
              fontSize: 12,
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            ← Prev
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  padding: "5px 10px",
                  border: `1px solid ${page === p ? "#4f46e5" : "#d1d5db"}`,
                  borderRadius: 6,
                  background: page === p ? "#4f46e5" : "#fff",
                  color: page === p ? "#fff" : "#374151",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {p}
              </button>
            );
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "5px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              background: "#fff",
              cursor: page === totalPages ? "not-allowed" : "pointer",
              fontSize: 12,
              opacity: page === totalPages ? 0.5 : 1,
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateTable;