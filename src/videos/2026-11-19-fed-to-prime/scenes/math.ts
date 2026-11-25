import data from '../script.json';

const f = data.figures;

/** Federal funds target range, held Oct 28, 2026 (percent). */
export const FED_LOW = f.fedRangeLow.value; // 3.75
export const FED_HIGH = f.fedRangeHigh.value; // 4.00
/** Bank prime loan rate, H.15 via FRED DPRIME (percent). */
export const PRIME = f.prime.value; // 7.00
/** Observed gap between prime and the top of the Fed range (points). */
export const PRIME_GAP = Math.round((PRIME - FED_HIGH) * 100) / 100; // 3.00

/** Illustrative: interest-only on a constant $50,000 HELOC balance, +0.25 point. */
export const BALANCE = 50000;
export const HIKE_PTS = 0.25;
export const HIKE_PER_YEAR = (BALANCE * HIKE_PTS) / 100; // 125
export const HIKE_PER_MONTH = HIKE_PER_YEAR / 12; // 10.42

export const VOTES_HOLD = 10;
export const VOTES_HIKE = 2;
