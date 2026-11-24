import data from '../script.json';

const f = data.figures;

/** Rates for I bonds issued Nov 2026 – Apr 2027 (percent). */
export const FIXED = f.fixed.value; // 1.40
export const SEMI_INFLATION = f.semiannualInflation.value; // 2.04 (CPI-U Mar→Sep 2026)

/** CPI-U (NSA) Mar 2026 → Sep 2026, FRED CPIAUCNS. */
export const CPI_MAR = 330.213;
export const CPI_SEP = 336.94;
export const CPI_CHANGE = (CPI_SEP / CPI_MAR - 1) * 100; // 2.037 → 2.04

/** 31 CFR 359.14: [fixed/2 + inflation + inflation × fixed/2] × 2. */
const fx = FIXED / 100;
const inf = SEMI_INFLATION / 100;
export const COMPOSITE_COMPUTED = (fx / 2 + inf + inf * (fx / 2)) * 2 * 100; // 5.5086 → 5.51
export const COMPOSITE = f.composite.value; // 5.51 published
export const INFLATION_PART = Math.round((COMPOSITE_COMPUTED - FIXED) * 100) / 100; // 4.11

/** Illustrative: $10,000 for one six-month period at the composite rate. */
export const PRINCIPAL = 10000;
export const SIX_MONTH_INTEREST = (PRINCIPAL * (COMPOSITE / 100)) / 2; // 275.50

export const SOURCE = 'Rates for bonds issued Nov 2026–Apr 2027 · announced Oct 30, 2026';
