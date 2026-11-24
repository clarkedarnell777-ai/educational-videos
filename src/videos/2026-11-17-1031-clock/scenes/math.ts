import data from '../script.json';

const f = data.figures;
const DAY_MS = 24 * 60 * 60 * 1000;

const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};
const addDays = (t: number, n: number) => t + n * DAY_MS;
const fmt = (t: number) =>
  new Date(t).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'});

export const IDENTIFY_DAYS = f.identifyDays.value; // 45
export const RECEIVE_DAYS = f.receiveDays.value; // 180

/** Illustrative sale (Nov 17, 2026) and the dates that follow, computed here. */
export const SALE = parse(f.exampleSaleDate.value);
export const DUE = parse(f.returnDueDate.value); // Apr 15, 2027
export const DAY45 = addDays(SALE, IDENTIFY_DAYS); // Jan 1, 2027
export const DAY180 = addDays(SALE, RECEIVE_DAYS); // May 16, 2027
export const DUE_DAY = Math.round((DUE - SALE) / DAY_MS); // 149
export const DAYS_LOST = RECEIVE_DAYS - DUE_DAY; // 31

export const LABELS = {
  sale: fmt(SALE),
  day45: fmt(DAY45),
  day180: fmt(DAY180),
  due: fmt(DUE),
};

export const SOURCE = 'IRS 2026 Form 8824 instructions (Nov 9, 2026)';
