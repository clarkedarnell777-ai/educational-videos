import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const CORRECTION = data.figures.correctionThresholdPct.value; // 10
const BEAR = data.figures.bearThresholdPct.value; // 20

// "Drawdown ruler": 0% (the high) at the top, −25% at the bottom.
const W = 960;
const H = 900;
const TOP = 60;
const PX_PER_PT = 30;
const yAt = (pct: number) => TOP + pct * PX_PER_PT;
const X_AXIS = 120;

const Level: React.FC<{pct: number; start: number; color: string; title: string; sub: string}> = ({
  pct,
  start,
  color,
  title,
  sub,
}) => {
  const draw = useDraw(start, 24);
  const label = useSpring(start + 10);
  const y = yAt(pct);
  return (
    <g>
      <line x1={X_AXIS} y1={y} x2={W - 20} y2={y} stroke={color} strokeWidth={6} {...drawProps(draw)} />
      <text x={X_AXIS - 24} y={y + 12} textAnchor="end" fontSize={36} fontWeight={800} fill={color} opacity={label}>
        −{pct}%
      </text>
      <g opacity={label} transform={`translate(0 ${interpolate(label, [0, 1], [20, 0])})`}>
        <text x={X_AXIS + 40} y={y + 70} fontSize={56} fontWeight={800} fill={color}>
          {title}
        </text>
        <text x={X_AXIS + 40} y={y + 118} fontSize={36} fontWeight={400} fill={COLORS.text}>
          {sub}
        </text>
      </g>
    </g>
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const axis = useDraw(STAGGER * 2, 30);
  const peak = useSpring(STAGGER * 2);
  // A marker slides down the ruler, past −10% and on toward −20%, in step with the captions.
  const tenAt = captions[1].from; // "of 10% or more from a high."
  const twentyAt = captions[2].from; // "Twenty percent: a bear market."
  const depth = interpolate(frame, [40, tenAt + 50, twentyAt + 30], [0, CORRECTION + 1, BEAR], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Measured from the peak</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>How far is down?</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{fontFamily: FONT}}>
          <line x1={X_AXIS} y1={TOP} x2={X_AXIS} y2={yAt(25)} stroke={COLORS.muted} strokeWidth={4} {...drawProps(axis)} />
          <g opacity={peak}>
            <circle cx={X_AXIS} cy={TOP} r={18} fill={COLORS.green} />
            <text x={X_AXIS + 40} y={TOP + 14} fontSize={40} fontWeight={600} fill={COLORS.green}>
              Record high
            </text>
          </g>
          <Level pct={CORRECTION} start={tenAt} color={COLORS.accent} title="Correction" sub="10% or more below the high" />
          <Level pct={BEAR} start={twentyAt} color={COLORS.muted} title="Bear market" sub="20% or more below the high" />
          <circle cx={X_AXIS} cy={yAt(depth)} r={14} fill={COLORS.text} opacity={interpolate(frame, [36, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Common conventions, not official rules (Schwab)</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
