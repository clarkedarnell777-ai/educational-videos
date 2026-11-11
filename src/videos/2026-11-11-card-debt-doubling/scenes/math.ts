import data from '../script.json';

// Every derived number on screen is computed here from script.json figures.
// Illustrative assumptions: monthly compounding, no payments, no new charges or fees, constant rates.
export const CARD = data.figures.cardRate.value; // 22.36 (% APR, Fed G.19 Q3 2026)
export const SAVE = data.figures.savingsRate.value; // 0.38 (% APY, FDIC Oct 2026)
export const BALANCE = data.figures.exampleBalance.value; // 5,000 (illustrative)
export const CARD_BALANCES_T = data.figures.cardBalances.value; // 1.29 ($T, NY Fed Q3 2026)

/** Balance after `months` of monthly compounding at an annual rate in percent. */
export const grow = (principal: number, annualPct: number, months: number): number =>
  principal * Math.pow(1 + annualPct / 100 / 12, months);

/** Years for a balance to double with monthly compounding. */
export const doublingYears = (annualPct: number): number =>
  Math.log(2) / (12 * Math.log(1 + annualPct / 100 / 12));

export const CARD_DOUBLE_YRS = doublingYears(CARD); // ≈ 3.13
export const SAVE_DOUBLE_YRS = doublingYears(SAVE); // ≈ 182.4
export const CARD_INTEREST_12M = Math.round(grow(BALANCE, CARD, 12) - BALANCE); // ≈ 1,240
export const SAVE_INTEREST_12M = Math.round(grow(BALANCE, SAVE, 12) - BALANCE); // ≈ 19
