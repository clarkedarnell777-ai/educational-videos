import data from '../script.json';

const f = data.figures;

export const FED_LOW = 3.75;
export const FED_HIGH = 4.0;

/** Freddie Mac PMMS 30-yr fixed averages (percent). */
export const PMMS = [
  {label: 'Year ago', rate: f.pmmsYearAgo.value}, // 6.23
  {label: 'Nov 13', rate: f.pmmsNov13.value}, // 7.11
  {label: 'Nov 19', rate: f.pmmsNov19.value}, // 7.28
  {label: 'Nov 25', rate: f.pmmsNov25.value}, // 7.21
];

/** Monthly principal & interest on a fixed-rate loan. */
export const payment = (principal: number, ratePct: number, months = 360) => {
  const i = ratePct / 100 / 12;
  return (principal * i) / (1 - (1 + i) ** -months);
};

/** Illustrative: $300,000, 30-yr fixed, 7.11% vs 7.28% (P&I only). */
export const PRINCIPAL = 300000;
export const PAY_LOW = payment(PRINCIPAL, f.pmmsNov13.value); // 2018.12
export const PAY_HIGH = payment(PRINCIPAL, f.pmmsNov19.value); // 2052.64
export const PAY_DIFF = PAY_HIGH - PAY_LOW; // 34.52
