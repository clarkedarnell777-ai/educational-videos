import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {COMPOSITE, CPI_CHANGE, FIXED, INFLATION_PART, SOURCE} from './math';
import type {SceneProps} from './types';

const C = data.scenes[2].captions;
const FIXED_AT = C[0].from + 8;
const INFL_AT = C[1].from;

const Term: React.FC<{at: number; children: React.ReactNode; color?: string; label: string}> = ({at, children, color = COLORS.text, label}) => {
  const s = useSpring(at);
  return (
    <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 0', opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`}}>
      <div style={{fontSize: 96, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums'}}>{children}</div>
      <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted}}>{label}</div>
    </div>
  );
};

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const cpi = useDraw(INFL_AT + 10, 30);
  const rule = useDraw(INFL_AT + 30, 16);
  const cpiLabel = useSpring(INFL_AT + 30);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Right now</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Build the 5.51%</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Term at={FIXED_AT} color={COLORS.accent} label="fixed, for life">
          <CountUp to={FIXED} start={FIXED_AT} duration={24} decimals={2} suffix="%" />
        </Term>
        <Term at={INFL_AT} color={COLORS.green} label="from inflation">
          + <CountUp to={INFLATION_PART} start={INFL_AT} duration={24} decimals={2} suffix="%" />
        </Term>
        <svg width={960} height={20} viewBox="0 0 960 20">
          <path d="M 0 10 L 960 10" stroke={COLORS.text} strokeWidth={6} {...drawProps(rule)} />
        </svg>
        <Term at={INFL_AT + 36} label="composite">
          = {COMPOSITE.toFixed(2)}%
        </Term>
        <svg width={960} height={170} viewBox="0 0 960 170" style={{marginTop: 20, fontFamily: FONT}}>
          <path d="M 20 140 L 200 128 L 380 110 L 560 96 L 740 70 L 900 40" fill="none" stroke={COLORS.green} strokeWidth={6} strokeLinecap="round" {...drawProps(cpi)} />
          <text x={20} y={40} fontSize={32} fontWeight={600} fill={COLORS.muted} opacity={cpiLabel}>
            CPI-U Mar → Sep 2026: +{CPI_CHANGE.toFixed(2)}%
          </text>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>{SOURCE} · CPI-U via FRED · rounded</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
