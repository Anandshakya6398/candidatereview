import { useState } from "react";
import { calcPriority, getPriorityLabel } from "../utils/priority";
import { PRIORITY_STYLES } from "../data/constants";
import { ScoreBar, Slider, StarRating } from "./SharedUI";

const DetailPanel = ({ candidate, onClose, onUpdate, onCompare, compareSet }) => {
  const [tab, setTab]         = useState("overview");
  const [local, setLocal]     = useState(candidate);
  const [noteTime, setNoteTime] = useState("");
  const [noteText, setNoteText] = useState("");

  const update = (field, value) => {
    setLocal((prev) => {
      const next = { ...prev, [field]: value };
      next.priority_score = calcPriority(next);
      return next;
    });
  };

  const updateAssign = (field, value) => {
    setLocal((prev) => {
      const nextEval = {
        ...(prev.assignmentEval || { ui: 3, components: 3, state: 3, edge: 3, responsive: 3, a11y: 3 }),
        [field]: value,
      };
      const avg = Math.round(
        (Object.values(nextEval).reduce((a, b) => a + b, 0) / Object.keys(nextEval).length) * 20
      );
      const next = { ...prev, assignmentEval: nextEval, assignment_score: avg };
      next.priority_score = calcPriority(next);
      return next;
    });
  };

  const updateVideo = (field, value) => {
    setLocal((prev) => {
      const nextEval = {
        ...(prev.videoEval || { clarity: 3, confidence: 3, architecture: 3, tradeoff: 3, communication: 3 }),
        [field]: value,
      };
      const avg = Math.round(
        (Object.values(nextEval).reduce((a, b) => a + b, 0) / Object.keys(nextEval).length) * 20
      );
      const next = { ...prev, videoEval: nextEval, video_score: avg };
      next.priority_score = calcPriority(next);
      return next;
    });
  };

  const addNote = () => {
    if (!noteTime || !noteText) return;
    setLocal((prev) => ({
      ...prev,
      timestampNotes: [...(prev.timestampNotes || []), { time: noteTime, note: noteText }],
    }));
    setNoteTime("");
    setNoteText("");
  };

  const save = () => { onUpdate(local); onClose(); };

  const assignEval = local.assignmentEval || { ui: 3, components: 3, state: 3, edge: 3, responsive: 3, a11y: 3 };
  const videoEval  = local.videoEval      || { clarity: 3, confidence: 3, architecture: 3, tradeoff: 3, communication: 3 };
  const prio = getPriorityLabel(local.priority_score);
  const ps   = PRIORITY_STYLES[prio];
  const isCompared = compareSet.has(local.id);

  return (
    <div
      style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 480,
        background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        zIndex: 100, display: "flex", flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>{local.name}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{local.college}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ background: ps.bg, color: ps.text, padding: "6px 14px", borderRadius: 6, fontWeight: 700, fontSize: 13 }}>
              {prio} · {local.priority_score}
            </div>
            <button
              onClick={onClose}
              style={{ background: "#f3f4f6", border: "none", borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "#6b7280" }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {["overview", "assignment", "video", "scores"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                border: "1px solid", cursor: "pointer",
                borderColor: tab === t ? "#4f46e5" : "#e5e7eb",
                background: tab === t ? "#4f46e5" : "#fff",
                color: tab === t ? "#fff" : "#6b7280",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>

        {/* ── Overview Tab ── */}
        {tab === "overview" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
                Score Breakdown
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Assignment (30%)", val: local.assignment_score,    color: "#4f46e5" },
                  { label: "Video (25%)",      val: local.video_score,         color: "#0891b2" },
                  { label: "ATS (20%)",        val: local.ats_score,           color: "#16a34a" },
                  { label: "GitHub (15%)",     val: local.github_score,        color: "#d97706" },
                  { label: "Comm (10%)",       val: local.communication_score, color: "#db2777" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>{s.label}</div>
                    <ScoreBar value={s.val} color={s.color} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#f9fafb", borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                Adjust Scores
              </div>
              <Slider label="Assignment Score"    value={local.assignment_score}    onChange={(v) => update("assignment_score", v)} />
              <Slider label="Video Score"         value={local.video_score}         onChange={(v) => update("video_score", v)} />
              <Slider label="ATS Score"           value={local.ats_score}           onChange={(v) => update("ats_score", v)} />
              <Slider label="GitHub Score"        value={local.github_score}        onChange={(v) => update("github_score", v)} />
              <Slider label="Communication Score" value={local.communication_score} onChange={(v) => update("communication_score", v)} />
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                Status
              </div>
              <select
                value={local.status}
                onChange={(e) => setLocal((prev) => ({ ...prev, status: e.target.value }))}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
              </select>
            </div>
          </>
        )}

        {/* ── Assignment Tab ── */}
        {tab === "assignment" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>
              Assignment Evaluation
            </div>
            <StarRating label="UI Quality"           value={assignEval.ui}         onChange={(v) => updateAssign("ui", v)} />
            <StarRating label="Component Structure"  value={assignEval.components} onChange={(v) => updateAssign("components", v)} />
            <StarRating label="State Handling"       value={assignEval.state}      onChange={(v) => updateAssign("state", v)} />
            <StarRating label="Edge Case Handling"   value={assignEval.edge}       onChange={(v) => updateAssign("edge", v)} />
            <StarRating label="Responsiveness"       value={assignEval.responsive} onChange={(v) => updateAssign("responsive", v)} />
            <StarRating label="Accessibility"        value={assignEval.a11y}       onChange={(v) => updateAssign("a11y", v)} />
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>Computed Assignment Score</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#15803d" }}>
                {local.assignment_score}
                <span style={{ fontSize: 14, fontWeight: 400, color: "#4ade80" }}>/100</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Average of star ratings × 20</div>
            </div>
          </>
        )}

        {/* ── Video Tab ── */}
        {tab === "video" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>
              Video Evaluation
            </div>
            <StarRating label="Clarity"                  value={videoEval.clarity}       onChange={(v) => updateVideo("clarity", v)} />
            <StarRating label="Confidence"               value={videoEval.confidence}    onChange={(v) => updateVideo("confidence", v)} />
            <StarRating label="Architecture Explanation" value={videoEval.architecture}  onChange={(v) => updateVideo("architecture", v)} />
            <StarRating label="Tradeoff Reasoning"       value={videoEval.tradeoff}      onChange={(v) => updateVideo("tradeoff", v)} />
            <StarRating label="Communication"            value={videoEval.communication} onChange={(v) => updateVideo("communication", v)} />

            <div style={{ marginTop: 16, padding: "12px 14px", background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 700 }}>Computed Video Score</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1e40af" }}>
                {local.video_score}
                <span style={{ fontSize: 14, fontWeight: 400, color: "#93c5fd" }}>/100</span>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
              Timestamp Notes
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <input
                placeholder="MM:SS"
                value={noteTime}
                onChange={(e) => setNoteTime(e.target.value)}
                style={{ width: 70, padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12 }}
              />
              <input
                placeholder="Note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                style={{ flex: 1, padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12 }}
              />
              <button
                onClick={addNote}
                style={{ padding: "6px 12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
              >
                Add
              </button>
            </div>
            {(local.timestampNotes || []).map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "6px 10px", background: "#f9fafb", borderRadius: 6, marginBottom: 6, fontSize: 12 }}>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#4f46e5" }}>{n.time}</span>
                <span style={{ color: "#374151" }}>{n.note}</span>
              </div>
            ))}
          </>
        )}

        {/* ── Scores Tab ── */}
        {tab === "scores" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>
              Raw Scores
            </div>
            {[
              { label: "ATS Score",           val: local.ats_score,           color: "#16a34a" },
              { label: "Assignment Score",    val: local.assignment_score,    color: "#4f46e5" },
              { label: "Video Score",         val: local.video_score,         color: "#0891b2" },
              { label: "Communication Score", val: local.communication_score, color: "#db2777" },
              { label: "GitHub Score",        val: local.github_score,        color: "#d97706" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.val}</span>
                </div>
                <ScoreBar value={s.val} color={s.color} />
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#faf5ff", borderRadius: 8, border: "1px solid #e9d5ff" }}>
              <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, marginBottom: 4 }}>Priority Score Formula</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>
                = Assignment×0.30 + Video×0.25 + ATS×0.20 + GitHub×0.15 + Comm×0.10
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#6d28d9", marginTop: 8 }}>
                {local.priority_score}{" "}
                <span style={{ fontSize: 14 }}>
                  →{" "}
                  <span style={{ background: ps.bg, color: ps.text, padding: "2px 8px", borderRadius: 4 }}>
                    {prio}
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8, justifyContent: "space-between" }}>
        <button
          onClick={() => onCompare(local.id)}
          style={{
            padding: "8px 14px", borderRadius: 7,
            border: `1px solid ${isCompared ? "#4f46e5" : "#d1d5db"}`,
            background: isCompared ? "#ede9fe" : "#fff",
            color: isCompared ? "#4f46e5" : "#374151",
            fontSize: 13, cursor: "pointer", fontWeight: 600,
          }}
        >
          {isCompared ? "✓ In Compare" : "+ Compare"}
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{ padding: "8px 14px", borderRadius: 7, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{ padding: "8px 16px", borderRadius: 7, background: "#4f46e5", color: "#fff", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;