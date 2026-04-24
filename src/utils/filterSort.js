export const filterCandidates = (candidates, search, filters) => {
  return candidates.filter((c) => {
    const q = search.toLowerCase();
    if (
      search &&
      !c.name.toLowerCase().includes(q) &&
      !c.college.toLowerCase().includes(q)
    )
      return false;
    if (
      c.assignment_score < filters.assignmentRange[0] ||
      c.assignment_score > filters.assignmentRange[1]
    )
      return false;
    if (
      c.video_score < filters.videoRange[0] ||
      c.video_score > filters.videoRange[1]
    )
      return false;
    if (
      c.ats_score < filters.atsRange[0] ||
      c.ats_score > filters.atsRange[1]
    )
      return false;
    if (filters.status !== "all" && c.status !== filters.status) return false;
    return true;
  });
};

export const sortCandidates = (candidates, sortBy, sortDir) => {
  return [...candidates].sort((a, b) => {
    let av, bv;
    if (sortBy === "priority")        { av = a.priority_score;    bv = b.priority_score; }
    else if (sortBy === "assignment") { av = a.assignment_score;  bv = b.assignment_score; }
    else if (sortBy === "video")      { av = a.video_score;       bv = b.video_score; }
    else if (sortBy === "ats")        { av = a.ats_score;         bv = b.ats_score; }
    else                              { av = a.name;              bv = b.name; }
    if (sortDir === "asc") return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });
};

export const DEFAULT_FILTERS = {
  assignmentRange: [0, 100],
  videoRange:      [0, 100],
  atsRange:        [0, 100],
  status:          "all",
};