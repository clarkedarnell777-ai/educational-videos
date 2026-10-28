import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily} = loadFont('normal', {
  weights: ['400', '600', '800'],
  subsets: ['latin'],
});

export const FONT = fontFamily;

export const COLORS = {
  bg: '#0a0a0a',
  text: '#ffffff',
  muted: '#a1a1aa',
  accent: '#6366f1',
  green: '#22c55e',
  card: '#15151c',
  border: '#2a2a35',
};

// Safe zone (px). Nothing important may sit outside these margins.
export const SAFE = {top: 150, bottom: 170, side: 60};

// Height reserved for captions at the bottom of the safe zone.
export const CAPTION_H = 220;

// Width of the content column inside the side margins.
export const CONTENT_W = 1080 - SAFE.side * 2; // 960

// Minimum type sizes (enforced by scripts/check.mjs).
export const TYPE = {
  headline: 76, // >= 56
  body: 40, // >= 36
  label: 30, // >= 28
};

// Stagger between related elements (8–12 frames).
export const STAGGER = 10;
