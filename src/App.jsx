import { useState, useMemo, useCallback } from "react";

import { generateCandidates } from "./data/generateCandidates";
import { PRIORITY_STYLES, PAGE_SIZE } from "./data/constants";
import { filterCandidates, sortCandidates, DEFAULT_FILTERS } from "./utils/filterSort";

import SummaryBar     from "./components/SummaryBar";
import FilterPanel    from "./components/FilterPanel";
import CandidateTable from "./components/CandidateTable";
import DetailPanel    from "./components/DetailPanel";
import CompareModal   from "./components/CompareModal";

export default function App() {
  const [candidates,  setCandidates]  = useState(() => generateCandidates());
  const [search,      setSearch]      = useState("");
  const [filters,     setFilters]     = useState(DEFAULT_FILTERS);
  const [sortBy,      setSortBy]      = useState("priority");
  const [sortDir,     setSortDir]     = useState("desc");
  const [selected,    setSelected]    = useState(null);
  const [compareSet,  setCompareSet]  = useState(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [page,        setPage]        = useState(1);

  // ── Derived data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const f = filterCandidates(candidates, search, filters);
    return sortCandidates(f, sortBy, sortDir);
  }, [candidates, search, filters, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const compareList = candidates.filter((c) => compareSet.has(c.id));

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleUpdate = useCallback(
    (updated) => {
      setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      if (selected?.id === updated.id) setSelected(null);
    },
    [selected]
  );

  const toggleCompare = (id) => {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleFilters = (fn)  => { setFilters(fn); setPage(1); };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Top Bar ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, background: "#4f46e5", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>R</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#111827", letterSpacing: -0.3 }}>ReviewBoard</span>
          <span style={{ fontSize: 12, color: "#9ca3af", borderLeft: "1px solid #e5e7eb", paddingLeft: 12 }}>Hiring Dashboard</span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {compareSet.size > 0 && (
            <button
              onClick={() => setShowCompare(true)}
              style={{ padding: "7px 14px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, cursor: "pointer", fontWeight: 600 }}
            >
              Compare ({compareSet.size}) →
            </button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", maxWidth: 1400, margin: "0 auto", padding: "20px 20px", gap: 20 }}>

        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <FilterPanel filters={filters} setFilters={handleFilters} />

          {/* Priority Legend */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
              Priority Legend
            </div>
            {Object.entries(PRIORITY_STYLES).map(([key, s]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: s.bg, color: s.text, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>
                  {key}
                </span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <SummaryBar candidates={candidates} />

          {/* Search + Sort */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
            <input
              placeholder="Search by name or college..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ flex: 1, padding: "9px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, background: "#fff" }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, background: "#fff" }}
            >
              <option value="priority">Sort: Priority</option>
              <option value="assignment">Sort: Assignment</option>
              <option value="video">Sort: Video</option>
              <option value="ats">Sort: ATS</option>
              <option value="name">Sort: Name</option>
            </select>
            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              style={{ padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}
            >
              {sortDir === "desc" ? "↓ Desc" : "↑ Asc"}
            </button>
          </div>

          <CandidateTable
            filtered={filtered}
            paginated={paginated}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDir={sortDir}
            setSortDir={setSortDir}
            compareSet={compareSet}
            toggleCompare={toggleCompare}
            onSelect={setSelected}
          />
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && (
        <DetailPanel
          candidate={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onCompare={toggleCompare}
          compareSet={compareSet}
        />
      )}

      {/* Compare Modal */}
      {showCompare && compareList.length > 1 && (
        <CompareModal candidates={compareList} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
}