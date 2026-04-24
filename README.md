# ReviewBoard — Candidate Review Dashboard

A React-based hiring dashboard for reviewing, scoring, and comparing job candidates. Built with React 18, Vite, and plain inline styles.

---

## Features

- **Candidate Table** — paginated list of 100 candidates with scores across 5 dimensions
- **Search & Filter** — search by name or college, filter by score ranges and status
- **Sorting** — sort by priority, assignment, video, ATS score, or name (asc/desc)
- **Detail Drawer** — click any candidate to open a side panel with 4 tabs:
  - **Overview** — score breakdown with adjustable sliders and status control
  - **Assignment** — star-rating rubric (UI, components, state, edge cases, responsiveness, accessibility)
  - **Video** — star-rating rubric (clarity, confidence, architecture, tradeoff, communication) + timestamp notes
  - **Scores** — raw scores with the priority formula breakdown
- **Compare Mode** — select up to 3 candidates and compare them side-by-side
- **Priority System** — auto-computed weighted score with P0–P3 labels

---

## Priority Score Formula

```
Priority = Assignment×0.30 + Video×0.25 + ATS×0.20 + GitHub×0.15 + Communication×0.10
```

| Label | Score Range | Meaning         |
|-------|-------------|-----------------|
| P0    | ≥ 80        | Interview Now   |
| P1    | 65 – 79     | Strong Shortlist|
| P2    | 50 – 64     | Review Later    |
| P3    | < 50        | Reject          |

---

## Project Structure

```
src/
├── App.jsx                          # Root component — state, handlers, layout
│
├── data/
│   ├── constants.js                 # COLLEGES, NAMES, PRIORITY_STYLES, STATUS_COLORS, PAGE_SIZE
│   └── generateCandidates.js        # seededRandom() + generateCandidates() — 100 mock records
│
├── utils/
│   ├── priority.js                  # calcPriority(), getPriorityLabel(), getPriorityStyle()
│   └── filterSort.js                # filterCandidates(), sortCandidates(), DEFAULT_FILTERS
│
└── components/
    ├── SharedUI.jsx                 # PriorityBadge, ScoreBar, Slider, StarRating
    ├── SummaryBar.jsx               # Top stat cards (Total / Reviewed / Shortlisted / Pending)
    ├── FilterPanel.jsx              # Sidebar filters — score ranges + status dropdown
    ├── CandidateTable.jsx           # Main table with pagination and column sort buttons
    ├── DetailPanel.jsx              # Right-side drawer with 4 tabs + save/cancel footer
    └── CompareModal.jsx             # Full-screen modal for side-by-side candidate comparison
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/your-username/reviewboard.git
cd reviewboard
npm install
```

## Data Shape

```js
// Candidate object
{
  id: number,
  name: string,
  college: string,
  assignment_score: number,    // 0–100
  video_score: number,         // 0–100
  ats_score: number,           // 0–100
  github_score: number,        // 0–100
  communication_score: number, // 0–100
  priority_score: number,      // computed weighted score
  status: 'pending' | 'reviewed' | 'shortlisted',
  assignmentEval: object | null,  // star ratings per rubric dimension
  videoEval: object | null,       // star ratings per rubric dimension
  timestampNotes: { time: string, note: string }[]
}


---

## Key Design Decisions

**Seeded random data** — `generateCandidates()` uses a deterministic seeded PRNG so the same 100 candidates are generated on every run, making development and testing consistent.

**Derived state with `useMemo`** — filtering and sorting are computed from the source `candidates` array on every relevant state change rather than storing a separate derived array, keeping state minimal and updates simple.

**Score re-computation on rubric change** — when star ratings are updated in the Assignment or Video tabs, the corresponding score and the priority score are both recomputed immediately so the badge in the drawer header reflects the change live before saving.

**Compare limit of 3** — enforced in `toggleCompare` — adding a 4th candidate is silently ignored (the checkbox simply doesn't respond), keeping the comparison grid readable.
