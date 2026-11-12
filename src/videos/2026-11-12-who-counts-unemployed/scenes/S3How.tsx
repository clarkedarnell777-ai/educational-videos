import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {LABOR_FORCE_DISPLAY, LABOR_FORCE_M, SOURCE, U3, UNEMPLOYED_DISPLAY, UNEMPLOYED_M} from './math';
import type {SceneProps} from './types';

const OUT_OF_AT = data.scenes[2].captions[1].from; // "out of 170.7 million."
const RATE_AT = data.scenes[2].captions[2].from; // "That's 4.1%."
const BAR_W = 900;

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const line = useDraw(OUT_OF_AT - 6, 18);
  const denom = useSpring(OUT_OF_AT);
  const bar = useDraw(OUT_OF_AT + 6, 30);
  const slice = interpolate(frame, [RATE_AT - 10, RATE_AT + 20], [0, UNEMPLOYED_M / LABOR_FORCE_M], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const rate = useSpring(RATE_AT);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>October 2026</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>The official rate</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Enter delay={STAGGER * 2} style={{textAlign: 'center'}}>
          <CountUp to={UNEMPLOYED_DISPLAY} start={24} duration={40} decimals={1} suffix="M" style={{fontSize: 120, fontWeight: 800, color: COLORS.accent}} />
          <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>unemployed (met all three tests)</div>
        </Enter>
        <svg width={BAR_W} height={30} viewBox={`0 0 ${BAR_W} 30`} style={{margin: '18px 0'}}>
          <path d={`M 60 15 L ${BAR_W - 60} 15`} stroke={COLORS.text} strokeWidth={8} strokeLinecap="round" {...drawProps(line)} />
        </svg>
        <div style={{textAlign: 'center', opacity: denom, transform: `translateY(${interpolate(denom, [0, 1], [-30, 0])}px)`}}>
          <CountUp to={LABOR_FORCE_DISPLAY} start={OUT_OF_AT} duration={36} decimals={1} suffix="M" style={{fontSize: 96, fontWeight: 800}} />
          <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>in the labor force</div>
        </div>
        <svg width={BAR_W} height={110} viewBox={`0 0 ${BAR_W} 110`} style={{marginTop: 30, fontFamily: FONT}}>
          <rect x={0} y={20} width={BAR_W} height={70} rx={14} fill="none" stroke={COLORS.border} strokeWidth={4} {...drawProps(bar)} />
          <rect x={0} y={20} width={slice * BAR_W} height={70} rx={8} fill={COLORS.accent} />
        </svg>
        <div style={{fontSize: 140, fontWeight: 800, lineHeight: 1, color: COLORS.green, opacity: rate, transform: `scale(${interpolate(rate, [0, 1], [0.7, 1])})`}}>
          <CountUp to={U3} start={RATE_AT} duration={24} decimals={1} suffix="%" />
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>{SOURCE} · rounded</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
