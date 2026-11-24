import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {DAYS_LOST, RECEIVE_DAYS} from './math';
import type {SceneProps} from './types';

const LOSE_AT = data.scenes[0].captions[1].from; // "Your 1031 clock could lose a month."
const RED = '#ef4444';
const BAR_X = 40;
const BAR_W = 880;

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const page = useSpring(4);
  const flip = interpolate(frame, [8, 30], [90, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const outline = useDraw(18, 20);
  const fill = interpolate(frame, [26, LOSE_AT], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const snap = useSpring(LOSE_AT + 6);
  const fullW = BAR_W * fill;
  const keptW = fullW - snap * BAR_W * (DAYS_LOST / RECEIVE_DAYS);
  const gap = useSpring(LOSE_AT + 16);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Real estate tax timing</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Sold a rental <span style={{color: COLORS.green}}>this month?</span>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 50}}>
        <div style={{perspective: 900, opacity: page}}>
          <div style={{width: 340, borderRadius: 28, overflow: 'hidden', border: `3px solid ${COLORS.border}`, background: COLORS.card, transform: `rotateX(${flip}deg)`, transformOrigin: 'top center'}}>
            <div style={{background: COLORS.accent, fontSize: 44, fontWeight: 800, textAlign: 'center', padding: '14px 0', letterSpacing: 6}}>NOV</div>
            <div style={{fontSize: 150, fontWeight: 800, textAlign: 'center', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums'}}>17</div>
          </div>
        </div>
        <svg width={960} height={220} viewBox="0 0 960 220" style={{fontFamily: FONT}}>
          <text x={BAR_X} y={40} fontSize={34} fontWeight={600} fill={COLORS.muted}>{RECEIVE_DAYS}-day exchange window</text>
          <rect x={BAR_X} y={70} width={BAR_W} height={70} rx={16} fill="none" stroke={COLORS.border} strokeWidth={4} {...drawProps(outline)} />
          <rect x={BAR_X} y={70} width={Math.max(0, keptW)} height={70} rx={16} fill={COLORS.green} />
          <rect x={BAR_X + keptW} y={70} width={Math.max(0, fullW - keptW)} height={70} fill={RED} opacity={0.35 * gap} />
          <text x={BAR_X + BAR_W - 10} y={195} textAnchor="end" fontSize={44} fontWeight={800} fill={RED} opacity={gap}>
            −{DAYS_LOST} days?
          </text>
        </svg>
      </div>
    </SceneFrame>
  );
};
