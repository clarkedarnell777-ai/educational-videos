import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {COMPOSITE, FIXED, INFLATION_PART} from './math';
import type {SceneProps} from './types';

const C = data.scenes[1].captions;
const FIXED_AT = C[1].from; // "a fixed rate locked for life,"
const INFL_AT = C[2].from; // "plus an inflation rate reset every six months."
const H = 600; // bar height = composite
const fixedH = (H * FIXED) / COMPOSITE;
const inflH = (H * INFLATION_PART) / COMPOSITE;

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const whole = useSpring(6);
  const split = interpolate(frame, [FIXED_AT - 10, FIXED_AT + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const fixedLabel = useSpring(FIXED_AT + 6);
  const lock = useDraw(FIXED_AT + 10, 20);
  const inflLabel = useSpring(INFL_AT + 4);
  const spin = interpolate(frame, [INFL_AT, INFL_AT + 60], [0, 360], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gap = split * 24;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>How an I bond pays</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>One rate, two parts</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={700} viewBox="0 0 960 700" style={{fontFamily: FONT}}>
          <g opacity={whole}>
            {/* inflation block (top) */}
            <rect x={60} y={40} width={300} height={inflH} rx={18} fill={split > 0 ? COLORS.green : COLORS.accent} opacity={0.35 + 0.65 * split} />
            {/* fixed block (bottom) */}
            <rect x={60} y={40 + inflH + gap} width={300} height={fixedH} rx={18} fill={COLORS.accent} />
          </g>
          {/* lock */}
          <g transform={`translate(440 ${40 + inflH + gap + fixedH / 2 - 40})`} opacity={fixedLabel}>
            <path d="M 12 36 L 12 20 A 22 22 0 0 1 56 20 L 56 36" fill="none" stroke={COLORS.accent} strokeWidth={7} {...drawProps(lock)} />
            <rect x={0} y={36} width={68} height={52} rx={10} fill={COLORS.accent} />
            <text x={100} y={44} fontSize={48} fontWeight={800} fill={COLORS.text}>Fixed</text>
            <text x={100} y={88} fontSize={34} fontWeight={600} fill={COLORS.muted}>locked for life</text>
          </g>
          {/* refresh */}
          <g transform={`translate(474 ${40 + inflH / 2 - 30})`} opacity={inflLabel}>
            <g transform={`rotate(${spin})`}>
              <path d="M 0 -30 A 30 30 0 1 1 -28 10" fill="none" stroke={COLORS.green} strokeWidth={7} strokeLinecap="round" />
              <path d="M -40 0 L -28 14 L -14 2" fill="none" stroke={COLORS.green} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x={66} y={-6} fontSize={48} fontWeight={800} fill={COLORS.text}>Inflation</text>
            <text x={66} y={38} fontSize={34} fontWeight={600} fill={COLORS.muted}>resets every 6 months</text>
          </g>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Fixed rate set for the life of the bond · 31 CFR 359.10</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
