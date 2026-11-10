import data from '../script.json';

// Illustrative rental, computed from script.json so every on-screen number shares one source.
export const RATE = data.figures.rate30.value; // 7.18% (Freddie Mac PMMS, Nov 5, 2026)
const MONTHS = data.figures.termMonths.value; // 360
export const PRICE = data.figures.examplePrice.value; // $300,000
export const NOI = data.figures.exampleNoi.value; // $18,000 / yr
export const DOWN_PCT = data.figures.exampleDownPct.value; // 25%

export const CAP = (NOI / PRICE) * 100; // 6.00%
export const DOWN = PRICE * (DOWN_PCT / 100); // $75,000
export const LOAN = PRICE - DOWN; // $225,000
const r = RATE / 100 / 12;
export const PAYMENT = (LOAN * r) / (1 - (1 + r) ** -MONTHS); // $1,524.23 / mo
export const DEBT_SERVICE = PAYMENT * 12; // $18,290.74 / yr
export const CONSTANT = (DEBT_SERVICE / LOAN) * 100; // 8.13%
export const CASH_FLOW = NOI - DEBT_SERVICE; // −$290.74 / yr
export const CASH_ON_CASH = (CASH_FLOW / DOWN) * 100; // −0.39%

export const usd = (v: number) => `${v < 0 ? '−' : ''}$${Math.round(Math.abs(v)).toLocaleString('en-US')}`;
export const pct = (v: number, decimals = 1) => `${v < 0 ? '−' : ''}${Math.abs(v).toFixed(decimals)}%`;
