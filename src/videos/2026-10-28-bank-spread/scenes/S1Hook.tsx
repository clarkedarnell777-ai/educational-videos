import React from 'react';
import {Enter, CountUp, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const SAVINGS = data.figures.savingsRate.value; // 0.38
const CARD = data.figures.cardApr.value; // 21.00
const BAR_MAX = 640;

const Bar: React.FC<{
  value: number;
  decimals: number;
  label: string;
  color: string;
  delay: number;
}> = ({value, decimals, label, color, delay}) => {
  const s = useSpring(delay);
  const h = Math.max(12, (value / CARD) * BAR_MAX * s);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 380}}>
      <div style={{fontSize: 96, fontWeight: 800, color, marginBottom: 20}}>
        <CountUp to={value} start={delay} duration={34} decimals={decimals} suffix="%" />
      </div>
      <div style={{height: BAR_MAX, display: 'flex', alignItems: 'flex-end'}}>
        <div style={{width: 220, height: h, background: color, borderRadius: '18px 18px 6px 6px'}} />
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: 36,
          fontWeight: 600,
          color: COLORS.text,
          textAlign: 'center',
          opacity: s,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The bank gap</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Where does the gap go?
        </div>
      </Enter>
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          paddingBottom: 10,
        }}
      >
        <Bar value={SAVINGS} decimals={2} label="Avg. savings rate" color={COLORS.green} delay={STAGGER * 2} />
        <Bar value={CARD} decimals={0} label="Credit card APR" color={COLORS.accent} delay={STAGGER * 3} />
      </div>
      <Enter delay={STAGGER * 5}>
        <SourceTag>FDIC national savings avg., Oct 2026 · Fed G.19 card APR, Q1 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
