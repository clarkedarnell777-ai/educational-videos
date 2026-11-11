import type React from 'react';
import {BankSpread} from './2026-10-28-bank-spread/Video';
import bankSpread from './2026-10-28-bank-spread/script.json';
import {RealVsNominalGdp} from './2026-10-30-real-vs-nominal-gdp/Video';
import realVsNominalGdp from './2026-10-30-real-vs-nominal-gdp/script.json';
import {SbaCoverageRule} from './2026-11-02-sba-coverage-rule/Video';
import sbaCoverageRule from './2026-11-02-sba-coverage-rule/script.json';
import {CashFlowVsNetWorth} from './2026-11-04-cash-flow-vs-net-worth/Video';
import cashFlowVsNetWorth from './2026-11-04-cash-flow-vs-net-worth/script.json';
import {PayVsInflation} from './2026-11-05-pay-vs-inflation/Video';
import payVsInflation from './2026-11-05-pay-vs-inflation/script.json';
import {CardDebtDoubling} from './2026-11-11-card-debt-doubling/Video';
import cardDebtDoubling from './2026-11-11-card-debt-doubling/script.json';

export type VideoProps = {withAudio: boolean; showSafeZone: boolean};

export type VideoEntry = {
  /** Folder name under src/videos and public/ — YYYY-MM-DD-slug */
  slug: string;
  component: React.FC<VideoProps>;
  data: {
    id: string;
    fps: number;
    width: number;
    height: number;
    totalFrames: number;
    transitionFrames: number;
    scenes: {frames: number}[];
  };
};

// Add each new day's video here (newest last).
export const VIDEOS: VideoEntry[] = [
  {slug: '2026-10-28-bank-spread', component: BankSpread, data: bankSpread},
  {slug: '2026-10-30-real-vs-nominal-gdp', component: RealVsNominalGdp, data: realVsNominalGdp},
  {slug: '2026-11-02-sba-coverage-rule', component: SbaCoverageRule, data: sbaCoverageRule},
  {slug: '2026-11-04-cash-flow-vs-net-worth', component: CashFlowVsNetWorth, data: cashFlowVsNetWorth},
  {slug: '2026-11-05-pay-vs-inflation', component: PayVsInflation, data: payVsInflation},
  {slug: '2026-11-11-card-debt-doubling', component: CardDebtDoubling, data: cardDebtDoubling},
];
