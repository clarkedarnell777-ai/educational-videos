import data from '../script.json';

// Daily Nasdaq Composite closes, Oct 6 → Nov 5, 2026 (FRED NASDAQCOM).
export const CLOSES = (data.figures.closes.value as [string, number][]).map(([date, close]) => ({date, close}));

export const RECORD = data.figures.recordClose.value; // 27,599.89 (Oct 6)
export const LAST = data.figures.lastClose.value; // 24,315.00 (Nov 5)
export const PRIOR = data.figures.priorClose.value; // 25,736.51 (Nov 4)

export const DAY_PCT = (LAST / PRIOR - 1) * 100; // −5.52
export const DRAWDOWN_PCT = (LAST / RECORD - 1) * 100; // −11.90

/** Map the closes into an SVG box; returns points and the y for any index level. */
export const layout = (w: number, h: number, lo: number, hi: number) => {
  const y = (v: number) => ((hi - v) / (hi - lo)) * h;
  const pts = CLOSES.map((c, i) => ({x: (i / (CLOSES.length - 1)) * w, y: y(c.close)}));
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  return {pts, d, y};
};
