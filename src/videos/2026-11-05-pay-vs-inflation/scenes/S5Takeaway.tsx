import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const COMPARE = data.scenes[4].captions[1].from; // "compare your raise to inflation."

const Side: React.FC<{label: string; color: string; delay: number}> = ({label, color, delay}) => (
  <Enter delay={delay} style={{flex: 1}}>
    <div
      style={{
        background: COLORS.card,
        border: `3px solid ${color}`,
        borderRadius: 28,
        padding: '40px 20px',
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 800,
        color,
      }}
    >
      {label}
    </div>
  </Enter>
);

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const vs = useSpring(COMPARE + 6);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Next review</Kicker>
      </Enter>
      <Enter delay={STAGGER / 2}>
        <div style={{fontSize: 88, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Did your raise beat inflation?</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 24}}>
        <Side label="Your raise %" color={COLORS.green} delay={STAGGER * 2} />
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.accent,
            opacity: vs,
            transform: `scale(${interpolate(vs, [0, 1], [0.6, 1])})`,
          }}
        >
          vs
        </div>
        <Side label="Inflation %" color={COLORS.text} delay={COMPARE + STAGGER} />
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Educational only · not financial advice</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
