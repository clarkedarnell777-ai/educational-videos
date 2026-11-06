import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const PAY = data.figures.wageGrowth.value; // 3.0
const PRICES = data.figures.cpiGrowth.value; // 3.7
const LOST = data.scenes[0].captions[1].from; // "Workers still lost ground."
const PAY_START = 24;
const PRICE_START = 44;
const MAX = 4; // % at full bar width
const BAR_W = 900;

const Racer: React.FC<{label: string; value: number; start: number; color: string; textColor: string}> = ({
  label,
  value,
  start,
  color,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + 40], [0, value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{marginBottom: 56}}>
      <div style={{fontSize: 44, fontWeight: 600, marginBottom: 16}}>{label}</div>
      <div style={{width: BAR_W, height: 140, borderRadius: 24, background: COLORS.card, position: 'relative'}}>
        <div
          style={{
            width: (v / MAX) * BAR_W,
            height: '100%',
            borderRadius: 24,
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 28,
            boxSizing: 'border-box',
          }}
        >
          <span style={{fontSize: 72, fontWeight: 800, color: textColor, fontVariantNumeric: 'tabular-nums', opacity: v > 0.9 ? 1 : 0}}>
            +{v.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const badge = useSpring(LOST);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Sep 2025 → Sep 2026</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Your pay went up. Your buying power didn't.
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Racer label="Average hourly pay" value={PAY} start={PAY_START} color={COLORS.green} textColor={COLORS.bg} />
        <Racer label="Prices (CPI)" value={PRICES} start={PRICE_START} color={COLORS.text} textColor={COLORS.bg} />
        <div
          style={{
            alignSelf: 'flex-start',
            padding: '18px 34px',
            borderRadius: 999,
            background: COLORS.accent,
            fontSize: 48,
            fontWeight: 800,
            opacity: badge,
            transform: `scale(${interpolate(badge, [0, 1], [0.8, 1])})`,
          }}
        >
          Prices won the race
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>BLS, September 2026 · private-sector averages</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
