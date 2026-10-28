import React from 'react';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const F = data.figures;
// Headline gap from scene 1: card APR minus average savings rate (21.00 - 0.38 = 20.62 pts)
const GAP = Math.round((F.cardApr.value - F.savingsRate.value) * 100) / 100;
const NIM = F.nim.value; // 3.32

const HBar: React.FC<{
  label: string;
  value: number;
  suffix: string;
  color: string;
  delay: number;
}> = ({label, value, suffix, color, delay}) => {
  const s = useSpring(delay);
  return (
    <div style={{opacity: Math.min(1, s * 1.5)}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{fontSize: 36, fontWeight: 600}}>{label}</div>
        <div style={{fontSize: 56, fontWeight: 800, color}}>
          <CountUp to={value} start={delay} duration={34} decimals={2} suffix={suffix} />
        </div>
      </div>
      <div style={{marginTop: 12, height: 40, borderRadius: 12, background: '#22222b', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${(value / GAP) * 100 * s}%`, background: color, borderRadius: 12}} />
      </div>
    </div>
  );
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const stat = useSpring(STAGGER * 6);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The real-world number</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.08, marginTop: 14}}>
          What banks actually keep
        </div>
      </Enter>
      <Enter delay={STAGGER * 2}>
        <div style={{fontSize: 40, fontWeight: 400, color: COLORS.muted, marginTop: 12}}>
          Across all loans, not just credit cards
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 48}}>
        <HBar label="Card APR − savings rate" value={GAP} suffix=" pts" color={COLORS.accent} delay={STAGGER * 3} />
        <HBar label="Avg. net interest margin" value={NIM} suffix="%" color={COLORS.green} delay={STAGGER * 4} />
        <div
          style={{
            marginTop: 10,
            background: COLORS.card,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 28,
            padding: '28px 36px',
            opacity: stat,
            transform: `scale(${0.94 + 0.06 * stat})`,
          }}
        >
          <div style={{fontSize: 96, fontWeight: 800, color: COLORS.text, lineHeight: 1.05}}>
            $<CountUp to={F.netIncomeBillions.value} start={STAGGER * 6} duration={36} decimals={1} suffix="B" />
          </div>
          <div style={{fontSize: 36, fontWeight: 400, color: COLORS.muted, marginTop: 6}}>
            U.S. bank net income in one quarter (Q2 2026)
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 8}>
        <SourceTag>FDIC Quarterly Banking Profile, Q2 2026 (released Aug 25, 2026)</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
