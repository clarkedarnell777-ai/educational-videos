import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const APPLICATIONS = data.figures.applications.value; // 534,947
const FORMATIONS = data.figures.projectedFormations.value; // 29,022
const ONE_IN = Math.round(APPLICATIONS / FORMATIONS); // 18 (computed)
const FIRST_AT = 128; // "Find your break-even first."

const Person: React.FC<{lit: boolean; delay: number}> = ({lit, delay}) => {
  const s = useSpring(delay);
  const color = lit ? COLORS.green : COLORS.border;
  return (
    <svg width={86} height={120} viewBox="0 0 86 120" style={{opacity: s, translate: `0px ${interpolate(s, [0, 1], [20, 0])}px`}}>
      <circle cx={43} cy={26} r={20} fill={color} />
      <path d="M 10 116 L 10 82 Q 10 56 43 56 Q 76 56 76 82 L 76 116 Z" fill={color} />
    </svg>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const people = Array.from({length: ONE_IN}, (_, i) => i);
  const first = useSpring(FIRST_AT);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Before you file</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>About 1 in {ONE_IN}</div>
        <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted, marginTop: 10}}>
          projected to have payroll within a year
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 60}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 86px)', gap: '24px 48px', justifyContent: 'center'}}>
          {people.map((i) => (
            <Person key={i} lit={i === 0} delay={STAGGER * 2 + i * 2} />
          ))}
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            textAlign: 'center',
            opacity: first,
            scale: interpolate(first, [0, 1], [0.9, 1]),
          }}
        >
          Find your <span style={{color: COLORS.green}}>break-even</span> first
        </div>
      </div>
      <Enter delay={STAGGER * 4}>
        <SourceTag>
          Census projection for Sep 2026 applications ({FORMATIONS.toLocaleString('en-US')} of {APPLICATIONS.toLocaleString('en-US')}). Not a failure rate. Educational only, not financial advice.
        </SourceTag>
      </Enter>
    </SceneFrame>
  );
};
