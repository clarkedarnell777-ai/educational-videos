import data from '../script.json';

const f = data.figures;

/** Unemployed and labor force, millions (BLS Table A-1, Oct 2026, SA). */
export const UNEMPLOYED_M = f.unemployed.value; // 7.068
export const LABOR_FORCE_M = f.laborForce.value; // 170.683

/** Computed check: 7.068 / 170.683 = 4.14% → published 4.1%. */
export const U3_COMPUTED = (UNEMPLOYED_M / LABOR_FORCE_M) * 100;

/** Published rates (BLS Table A-15, Oct 2026, SA). */
export const U3 = f.u3Rate.value; // 4.1
export const U6 = f.u6Rate.value; // 7.9

/** Rounded for display: 7.1M of 170.7M. */
export const UNEMPLOYED_DISPLAY = Math.round(UNEMPLOYED_M * 10) / 10;
export const LABOR_FORCE_DISPLAY = Math.round(LABOR_FORCE_M * 10) / 10;

export const SOURCE = 'BLS, Oct 2026 (SA), released Nov 6, 2026';
