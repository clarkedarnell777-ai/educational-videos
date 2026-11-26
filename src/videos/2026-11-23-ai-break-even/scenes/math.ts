import data from '../script.json';

const f = data.figures;

/** Census BTOS national AI-use rate (percent), period ending May 3, 2026. */
export const AI_RATE = f.aiUseRate.value; // 19.8
export const LARGE_FIRMS = f.aiUseLargeFirms.value; // 37 (250+ employees)
export const SMALL_FIRMS_CAP = 20; // "less than 20%" (1-4 employees): bar drawn at the cap, labeled "under 20%"
export const NO_HEADCOUNT_CHANGE = f.noHeadcountChange.value; // 96

/** Illustrative break-even (not data). */
const ex = f.illustrativeBreakEven.value;
export const TOOL_PER_MONTH = ex.toolPerMonth; // $30
export const TIME_PER_HOUR = ex.timePerHour; // $25
export const HOURS_SAVED = ex.hoursSaved; // 8

export const BREAK_EVEN_HOURS = TOOL_PER_MONTH / TIME_PER_HOUR; // 1.2
export const VALUE_SAVED = HOURS_SAVED * TIME_PER_HOUR; // 200
export const NET_PER_MONTH = VALUE_SAVED - TOOL_PER_MONTH; // 170

if (Math.abs(BREAK_EVEN_HOURS - ex.breakEvenHours) > 1e-9 || NET_PER_MONTH !== ex.net) {
  throw new Error('Illustrative break-even math does not match script.json');
}
