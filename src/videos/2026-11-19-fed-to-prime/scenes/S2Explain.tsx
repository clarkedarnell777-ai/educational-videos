import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const C = data.scenes[1].captions;
const ARC_AT = C[0].from + 6;
const STACK_AT = C[2].from;
const BLOCKS = ['Prime', 'HELOC', 'Credit card', 'Business loan'];

const Bank: React.FC<{x: number; s: number}> = ({x, s}) => (
  <g transform={`translate(${x} 600)`} opacity={s}>
    <path d="M -70 -40 L 0 -85 L 70 -40 Z" fill={COLORS.accent} />
    {[-48, -16, 16, 48].map((c) => (
      <rect key={c} x={c - 8} y={-34} width={16} height={58} fill={COLORS.text} opacity={0.85} />
    ))}
    <rect x={-76} y={26} width={152} height={14} rx={4} fill={COLORS.accent} />
  </g>
);

const Block: React.FC<{label: string; i: number}> = ({label, i}) => {
  const s = useSpring(STACK_AT + i * STAGGER);
  const y = 330 - i * 74;
  return (
    <g opacity={s} transform={`translate(0 ${interpolate(s, [0, 1], [-60, 0])})`}>
      <rect x={260} y={y - 60} width={440} height={62} rx={14} fill={i === 0 ? COLORS.green : COLORS.card} stroke={i === 0 ? COLORS.green : COLORS.border} strokeWidth={3} />
      <text x={480} y={y - 18} textAnchor="middle" fontSize={34} fontWeight={800} fill={i === 0 ? COLORS.bg : COLORS.text}>
        {label}
      </text>
    </g>
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const banks = useSpring(ARC_AT - 6);
  const arc = useDraw(ARC_AT, 30);
  const t = interpolate(frame, [ARC_AT + 10, ARC_AT + 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // coin along quadratic bezier (200,560) -> (480,380) -> (760,560)
  const cx = (1 - t) ** 2 * 200 + 2 * (1 - t) * t * 480 + t ** 2 * 760;
  const cy = (1 - t) ** 2 * 540 + 2 * (1 - t) * t * 380 + t ** 2 * 540;
  const label = useSpring(ARC_AT + 20);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The starting rate</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>One Fed rate. Others stack on top.</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={760} viewBox="0 0 960 760" style={{fontFamily: FONT}}>
          {BLOCKS.map((b, i) => (
            <Block key={b} label={b} i={i} />
          ))}
          <path d="M 200 540 Q 480 380 760 540" fill="none" stroke={COLORS.accent} strokeWidth={8} strokeLinecap="round" {...drawProps(arc)} />
          <text x={480} y={420} textAnchor="middle" fontSize={40} fontWeight={800} fill={COLORS.accent} opacity={label}>
            Fed funds rate
          </text>
          <text x={480} y={710} textAnchor="middle" fontSize={30} fontWeight={600} fill={COLORS.muted} opacity={label}>
            overnight loans between banks
          </text>
          <Bank x={200} s={banks} />
          <Bank x={760} s={banks} />
          <g opacity={t > 0 && t < 1 ? 1 : 0}>
            <circle cx={cx} cy={cy} r={24} fill={COLORS.green} />
            <text x={cx} y={cy + 11} textAnchor="middle" fontSize={30} fontWeight={800} fill={COLORS.bg}>
              $
            </text>
          </g>
        </svg>
      </div>
    </SceneFrame>
  );
};
