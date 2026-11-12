import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {SOURCE, U3, U6} from './math';
import type {SceneProps} from './types';

const PART_AT = data.scenes[3].captions[1].from; // "plus part-timers wanting more hours,"
const RATE_AT = data.scenes[3].captions[2].from; // "and the broader rate is 7.9%."

const BASE = 700; // y of 0%
const PX = 80; // px per percentage point (7.9% → 632 px)
const X = 90;
const W = 300;

const Layer: React.FC<{text: string; at: number; y: number}> = ({text, at, y}) => {
  const s = useSpring(at);
  return (
    <g opacity={s} transform={`translate(${interpolate(s, [0, 1], [40, 0])} 0)`}>
      <line x1={X + W + 16} y1={y} x2={X + W + 60} y2={y} stroke={COLORS.green} strokeWidth={4} />
      <text x={X + W + 76} y={y + 12} fontSize={36} fontWeight={600} fill={COLORS.text}>
        + {text}
      </text>
    </g>
  );
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const base = interpolate(frame, [16, 46], [0, U3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  // The added band grows from 4.1% toward 7.9% as the two groups are named.
  const top = interpolate(frame, [30, PART_AT, PART_AT + 30, RATE_AT + 10], [U3, U3 + (U6 - U3) / 2, U3 + (U6 - U3) / 2, U6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const extraShown = frame >= 30;
  const rate = useSpring(RATE_AT + 6);
  const lens = useSpring(RATE_AT + 30);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Same month. Wider lens.</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>The broader rate</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={820} viewBox="0 0 960 820" style={{fontFamily: FONT}}>
          <line x1={40} y1={BASE} x2={920} y2={BASE} stroke={COLORS.muted} strokeWidth={4} />
          {extraShown ? (
            <rect x={X} y={BASE - top * PX} width={W} height={(top - U3) * PX} rx={12} fill="rgba(34,197,94,0.12)" stroke={COLORS.green} strokeWidth={5} strokeDasharray="14 10" />
          ) : null}
          <rect x={X} y={BASE - base * PX} width={W} height={base * PX} rx={12} fill={COLORS.accent} />
          <text x={X + W / 2} y={BASE - base * PX / 2 + 24} textAnchor="middle" fontSize={64} fontWeight={800} fill={COLORS.text} opacity={base > 1 ? 1 : 0} style={{fontVariantNumeric: 'tabular-nums'}}>
            {base.toFixed(1)}%
          </text>
          <text x={X + W / 2} y={BASE + 54} textAnchor="middle" fontSize={36} fontWeight={600} fill={COLORS.text}>Official (U-3)</text>
          <Layer text="stopped looking" at={24} y={BASE - (U3 + 1) * PX} />
          <Layer text="part-time, want full-time" at={PART_AT} y={BASE - (U3 + 2.6) * PX} />
          <text x={X + W / 2} y={BASE - U6 * PX - 26} textAnchor="middle" fontSize={76} fontWeight={800} fill={COLORS.green} opacity={rate} style={{fontVariantNumeric: 'tabular-nums'}}>
            {U6.toFixed(1)}%
          </text>
          <text x={X + W + 76} y={BASE - 30} fontSize={36} fontWeight={600} fill={COLORS.green} opacity={rate}>= Broader (U-6)</text>
        </svg>
      </div>
      <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted, opacity: lens, marginBottom: 16}}>
        U-6 is a broader BLS measure, not the headline rate.
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>{SOURCE} · Table A-15</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
