import type React from 'react';
import {BankSpread} from './2026-10-28-bank-spread/Video';
import bankSpread from './2026-10-28-bank-spread/script.json';
import {RealVsNominalGdp} from './2026-10-30-real-vs-nominal-gdp/Video';
import realVsNominalGdp from './2026-10-30-real-vs-nominal-gdp/script.json';

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
];
