import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import {CAP, CONSTANT, pct} from './math';
import type {SceneProps} from './types';

const Gauge: React.FC<{label: string; value: string; color: string; delay: number}> = ({label, value, color, delay}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        flex: 1,
        background: COLORS.card,
        border: `2px solid ${COLORS.border}`,
        borderRadius: 28,
        padding: '34px 24px',
        textAlign: 'center',
        opacity: s,
        translate: `0px ${interpolate(s, [0, 1], [40, 0])}px`,
      }}
    >
      <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>{label}</div>
      <div style={{fontSize: 96, fontWeight: 800, color}}>{value}</div>
    </div>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const checkAt = captions[1].from; // "make sure the cap rate beats your loan's cost."
  const sign = useSpring(STAGGER * 3);
  const goal = useSpring(checkAt);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Before you borrow</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Compare two numbers</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 48}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <Gauge label="Cap rate" value={pct(CAP)} color={COLORS.green} delay={STAGGER} />
          <div style={{fontSize: 96, fontWeight: 800, opacity: sign, scale: interpolate(sign, [0, 1], [0.6, 1])}}>&lt;</div>
          <Gauge label="Loan cost" value={pct(CONSTANT)} color={COLORS.accent} delay={STAGGER * 2} />
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            textAlign: 'center',
            opacity: goal,
            scale: interpolate(goal, [0, 1], [0.9, 1]),
          }}
        >
          Cap rate <span style={{color: COLORS.green}}>&gt;</span> loan cost?
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Loan cost = yearly payments ÷ loan. Educational only, not financial advice.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
