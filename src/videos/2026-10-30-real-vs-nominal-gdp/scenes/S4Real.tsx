import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const RAISE = data.figures.exampleRaise.value; // 5
const INFLATION = data.figures.exampleInflation.value; // 3
// Exact real change, computed in code: (1.05 / 1.03 − 1) × 100 = 1.94
const REAL_EXACT = ((1 + RAISE / 100) / (1 + INFLATION / 100) - 1) * 100;
const REAL_SHOWN = Math.round(REAL_EXACT); // ≈ 2

const TRACK = 560; // px for 5%
const PX = TRACK / RAISE;

const PaycheckIcon: React.FC<{delay: number}> = ({delay}) => {
  const p = useDraw(delay, 24);
  return (
    <svg width={150} height={100} viewBox="0 0 150 100">
      <rect x={4} y={4} width={142} height={92} rx={12} fill="none" stroke={COLORS.green} strokeWidth={5} {...drawProps(p)} />
      <circle cx={42} cy={50} r={20} fill="none" stroke={COLORS.green} strokeWidth={5} {...drawProps(p)} />
      <path d="M 78 38 L 128 38 M 78 62 L 116 62" stroke={COLORS.green} strokeWidth={6} strokeLinecap="round" {...drawProps(p)} />
    </svg>
  );
};

const Row: React.FC<{
  label: string;
  value: number;
  sign: string;
  color: string;
  delay: number;
  offset?: number;
}> = ({label, value, sign, color, delay, offset = 0}) => {
  const s = useSpring(delay);
  const grow = useSpring(delay + 8);
  return (
    <div style={{opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{fontSize: 40, fontWeight: 600}}>{label}</div>
        <div style={{fontSize: 56, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums'}}>
          <CountUp to={value} start={delay + 8} duration={24} prefix={sign} suffix="%" />
        </div>
      </div>
      <div style={{position: 'relative', height: 56, marginTop: 14, background: '#22222b', borderRadius: 14, width: TRACK}}>
        <div
          style={{
            position: 'absolute',
            left: offset * PX,
            top: 0,
            height: '100%',
            width: value * PX * grow,
            background: color,
            borderRadius: 14,
          }}
        />
      </div>
    </div>
  );
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const result = useSpring(143); // "buys about 2% more."
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0} style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <Kicker>Your paycheck</Kicker>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 2,
            color: COLORS.bg,
            background: COLORS.green,
            borderRadius: 10,
            padding: '6px 14px',
          }}
        >
          ILLUSTRATIVE
        </div>
      </Enter>
      <Enter delay={STAGGER} style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 14}}>
        <PaycheckIcon delay={STAGGER} />
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05}}>Same idea, smaller scale</div>
      </Enter>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 46,
          background: COLORS.card,
          border: `2px solid ${COLORS.border}`,
          borderRadius: 32,
          padding: '40px 50px',
          margin: 'auto 0',
        }}
      >
        <Row label="Raise" value={RAISE} sign="+" color={COLORS.accent} delay={69} />
        <Row label="Inflation" value={INFLATION} sign="−" color="#ef4444" delay={90} offset={RAISE - INFLATION} />
        <div
          style={{
            borderTop: `3px solid ${COLORS.border}`,
            paddingTop: 30,
            opacity: result,
            transform: `scale(${interpolate(result, [0, 1], [0.9, 1])})`,
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <div style={{fontSize: 40, fontWeight: 600}}>Buying power</div>
            <div style={{fontSize: 88, fontWeight: 800, color: COLORS.green}}>≈ +{REAL_SHOWN}%</div>
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>
          Illustrative: (1.05 ÷ 1.03) − 1 = {REAL_EXACT.toFixed(2)}%, rounded to ≈2%. Not a forecast.
        </SourceTag>
      </Enter>
    </SceneFrame>
  );
};
