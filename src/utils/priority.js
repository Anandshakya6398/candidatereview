import { PRIORITY_STYLES } from "../data/constants";

export const calcPriority = (c) =>
  Math.round(
    c.assignment_score   * 0.30 +
    c.video_score        * 0.25 +
    c.ats_score          * 0.20 +
    c.github_score       * 0.15 +
    c.communication_score* 0.10
  );

export const getPriorityLabel = (score) => {
  if (score >= 80) return "P0";
  if (score >= 65) return "P1";
  if (score >= 50) return "P2";
  return "P3";
};

export const getPriorityStyle = (score) => {
  const label = getPriorityLabel(score);
  return { label, ...PRIORITY_STYLES[label] };
};