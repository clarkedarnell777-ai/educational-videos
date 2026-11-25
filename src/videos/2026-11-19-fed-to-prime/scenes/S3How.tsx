import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {FED_HIGH, FED_LOW, PRIME, PRIME_GAP} from './math';
import type {SceneProps} from './types';

const C = data.scenes[2].captions;
const FED_AT = C[0].from;
const PRIME_AT = C[1].from;
const MARGIN_AT = C[2].from;

// Vertical scale: 0% at y=700, 1 point = 80 px
const Y = (pct: number) => 700 - pct * 80;

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const fed = useSpring(FED_AT);
  const prime = useSpring(PRIME_AT);
  const bracket = useDraw(PRIME_AT + 6, 20);
  const margin = useSpring(MARGIN_AT);
  const marginLabel = useSpring(MARGIN_AT + 10);
  const fedH = (Y(0) - Y(FED_HIGH)) * fed;
  const primeH = (Y(FED_HIGH) - Y(PRIME)) * prime;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>How it stacks</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>From the Fed to your rate</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={760} viewBox="0 0 960 760" style={{fontFamily: FONT}}>
          <line x1={160} y1={Y(0)} x2={600} y2={Y(0)} stroke={COLORS.border} strokeWidth={4} />
          {/* Fed range base */}
          <rect x={200} y={Y(0) - fedH} width={260} height={fedH} rx={10} fill={COLORS.accent} />
          <rect x={200} y={Y(FED_HIGH)} width={260} height={(Y(FED_LOW) - Y(FED_HIGH))} fill={COLORS.text} opacity={0.25 * fed} />
          <text x={490} y={Y(FED_HIGH) + 40} fontSize={36} fontWeight={800} fill={COLORS.accent} opacity={fed}>
            Fed range
          </text>
          <text x={490} y={Y(FED_HIGH) + 84} fontSize={34} fontWeight={600} fill={COLORS.text} opacity={fed}>
            {FED_LOW.toFixed(2)}–{FED_HIGH.toFixed(2)}%
          </text>
          {/* Prime layer */}
          <rect x={200} y={Y(FED_HIGH) - primeH} width={260} height={primeH} rx={10} fill={COLORS.green} />
          <path d={`M 180 ${Y(FED_HIGH)} L 164 ${Y(FED_HIGH)} L 164 ${Y(PRIME)} L 180 ${Y(PRIME)}`} fill="none" stroke={COLORS.text} strokeWidth={4} {...drawProps(bracket)} />
          <text x={150} y={(Y(FED_HIGH) + Y(PRIME)) / 2 + 12} textAnchor="end" fontSize={34} fontWeight={800} fill={COLORS.text} opacity={prime}>
            +{PRIME_GAP.toFixed(2)}
          </text>
          <text x={490} y={Y(PRIME) + 40} fontSize={36} fontWeight={800} fill={COLORS.green} opacity={prime}>
            Prime rate
          </text>
          {/* Margin (dashed) */}
          <rect x={200} y={Y(PRIME) - 90} width={260} height={90} rx={10} fill="none" stroke={COLORS.text} strokeWidth={4} strokeDasharray="16 12" opacity={margin} />
          <text x={490} y={Y(PRIME) - 50} fontSize={36} fontWeight={800} fill={COLORS.text} opacity={marginLabel}>
            + lender margin
          </text>
          <text x={490} y={Y(PRIME) - 8} fontSize={30} fontWeight={600} fill={COLORS.muted} opacity={marginLabel}>
            = your variable rate
          </text>
        </svg>
        <div style={{position: 'absolute', right: 0, top: 230, fontSize: 96, fontWeight: 800, color: COLORS.green, opacity: prime, transform: `translateY(${interpolate(prime, [0, 1], [20, 0])}px)`}}>
          <CountUp to={PRIME} start={PRIME_AT} duration={28} decimals={2} suffix="%" />
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Prime: Fed H.15 via FRED, Nov 23, 2026 · gap is observed, not a rule</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
