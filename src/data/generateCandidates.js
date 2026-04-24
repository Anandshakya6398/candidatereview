import { COLLEGES, FIRST_NAMES, LAST_NAMES } from "./constants";

export const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export const generateCandidates = () => {
  const rand = seededRandom(42);
  return Array.from({ length: 100 }, (_, i) => {
    const fn = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const assignment   = Math.round(30 + rand() * 70);
    const video        = Math.round(30 + rand() * 70);
    const ats          = Math.round(35 + rand() * 65);
    const github       = Math.round(25 + rand() * 75);
    const communication= Math.round(30 + rand() * 70);
    const priority     = Math.round(
      assignment * 0.30 + video * 0.25 + ats * 0.20 + github * 0.15 + communication * 0.10
    );
    return {
      id: i + 1,
      name: `${fn} ${ln}`,
      college: COLLEGES[Math.floor(rand() * COLLEGES.length)],
      assignment_score: assignment,
      video_score: video,
      ats_score: ats,
      github_score: github,
      communication_score: communication,
      priority_score: priority,
      status: rand() < 0.32 ? "reviewed" : rand() < 0.6 ? "shortlisted" : "pending",
      assignmentEval: null,
      videoEval: null,
      timestampNotes: [],
    };
  });
};