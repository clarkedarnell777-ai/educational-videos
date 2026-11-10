import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const APPLICATIONS = data.figures.applications.value; // 534,947
const COLS = 6;
const ROWS = 4;

// Small storefront: awning + door, drawn with stroke-dashoffset.
const Store: React.FC<{start: number}> = ({start}) => {
  const draw = useDraw(start, 18);
  const pop = useSpring(start);
  return (
    <svg width={120} height={110} viewBox="0 0 120 110" style={{opacity: pop, scale: interpolate(pop, [0, 1], [0.8, 1])}}>
      <path d="M 10 40 L 18 12 L 102 12 L 110 40 Z" fill="none" stroke={COLORS.accent} strokeWidth={6} strokeLinejoin="round" {...drawProps(draw)} />
      <path d="M 18 40 L 18 100 L 102 100 L 102 40" fill="none" stroke={COLORS.text} strokeWidth={6} strokeLinejoin="round" {...drawProps(draw)} />
      <path d="M 48 100 L 48 64 L 72 64 L 72 100" fill="none" stroke={COLORS.green} strokeWidth={6} strokeLinejoin="round" {...drawProps(draw)} />
    </svg>
  );
};

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const stores = Array.from({length: COLS * ROWS}, (_, i) => i);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>U.S. Census · September 2026</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 160, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          <CountUp to={APPLICATIONS} start={STAGGER} duration={40} />
        </div>
        <div style={{fontSize: 48, fontWeight: 600, color: COLORS.muted}}>new business applications in one month</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${COLS}, 120px)`, gap: '28px 36px'}}>
          {stores.map((i) => (
            <Store key={i} start={STAGGER * 3 + i * 3} />
          ))}
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Business Formation Statistics, seasonally adjusted · released Oct 14, 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
