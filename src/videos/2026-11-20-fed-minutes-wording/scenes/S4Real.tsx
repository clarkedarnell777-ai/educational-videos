import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {PAY_DIFF, PAY_HIGH, PAY_LOW, PMMS, PRINCIPAL} from './math';
import type {SceneProps} from './types';

const C = data.scenes[3].captions;
const LINE_AT = C[0].from;
const PEAK_AT = C[1].from;
const EASE_AT = C[2].from;

// Chart: x per point, y scale 6.0% -> 7.5%
const X = [80, 330, 580, 830];
const Y = (r: number) => 380 - ((r - 6.0) / 1.5) * 320;

const Point: React.FC<{i: number; at: number}> = ({i, at}) => {
  const s = useSpring(at);
  const p = PMMS[i];
  const hi = i === 2;
  return (
    <g opacity={s}>
      <circle cx={X[i]} cy={Y(p.rate)} r={hi ? 18 : 13} fill={hi ? COLORS.green : COLORS.text} />
      <text x={X[i]} y={i === 0 ? Y(p.rate) + 56 : Y(p.rate) - 34} textAnchor="middle" fontSize={40} fontWeight={800} fill={hi ? COLORS.green : COLORS.text}>
        {p.rate.toFixed(2)}%
      </text>
      <text x={X[i]} y={440} textAnchor="middle" fontSize={30} fontWeight={600} fill={COLORS.muted}>
        {p.label}
      </text>
    </g>
  );
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const seg1 = useDraw(LINE_AT, 30);
  const seg2 = useDraw(PEAK_AT - 4, 18);
  const seg3 = useDraw(EASE_AT, 18);
  const card = useSpring(EASE_AT + 24);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Mortgage rates</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>30-year fixed, Freddie Mac</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
        <svg width={960} height={470} viewBox="0 0 960 470" style={{fontFamily: FONT}}>
          <line x1={40} y1={400} x2={920} y2={400} stroke={COLORS.border} strokeWidth={3} />
          <path d={`M ${X[0]} ${Y(PMMS[0].rate)} L ${X[1]} ${Y(PMMS[1].rate)}`} stroke={COLORS.muted} strokeWidth={6} fill="none" {...drawProps(seg1)} />
          <path d={`M ${X[1]} ${Y(PMMS[1].rate)} L ${X[2]} ${Y(PMMS[2].rate)}`} stroke={COLORS.green} strokeWidth={8} fill="none" {...drawProps(seg2)} />
          <path d={`M ${X[2]} ${Y(PMMS[2].rate)} L ${X[3]} ${Y(PMMS[3].rate)}`} stroke={COLORS.accent} strokeWidth={8} fill="none" {...drawProps(seg3)} />
          <Point i={0} at={LINE_AT} />
          <Point i={1} at={LINE_AT + 24} />
          <Point i={2} at={PEAK_AT} />
          <Point i={3} at={EASE_AT + 10} />
        </svg>
        <div style={{padding: '28px 36px', borderRadius: 24, background: COLORS.card, border: `3px solid ${COLORS.border}`, opacity: card, transform: `translateY(${interpolate(card, [0, 1], [30, 0])}px)`}}>
          <div style={{fontSize: 30, fontWeight: 800, color: COLORS.accent, letterSpacing: 3}}>ILLUSTRATIVE · ${PRINCIPAL / 1000}K, 30-YR, P&I</div>
          <div style={{fontSize: 48, fontWeight: 800, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>
            ${Math.round(PAY_LOW).toLocaleString('en-US')} → ${Math.round(PAY_HIGH).toLocaleString('en-US')}/mo{' '}
            <span style={{color: COLORS.green}}>
              (+<CountUp to={Math.round(PAY_DIFF)} start={EASE_AT + 30} duration={20} prefix="$" />)
            </span>
          </div>
          <div style={{fontSize: 30, fontWeight: 600, color: COLORS.muted, marginTop: 6}}>at 7.11% vs 7.28%</div>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Freddie Mac PMMS, Nov 13 / 19 / 25, 2026 · shown together, not cause and effect</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
