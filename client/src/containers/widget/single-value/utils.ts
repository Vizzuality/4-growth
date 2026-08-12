/**
 * The same reading the single-source counter card gives: how much of the
 * available data this figure covers. Every per-source panel is handed the same
 * `total` by the API, so the bars stay comparable to each other and the width
 * left over is what the active filters excluded.
 */
export function barWidthPercentage(value: number, total: number): number {
  if (total <= 0) return 0;

  return Math.min((value / total) * 100, 100);
}
