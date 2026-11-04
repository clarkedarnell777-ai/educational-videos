import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

const Row: React.FC<{label: string; color: string; delay: number}> = ({label, color, delay}) => (
  <Enter delay={delay}>
    <div style={{fontSize: 76, fontWeight: 800, color}}>{label}</div>
  </Enter>
);

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const card = useSpring(STAGGER * 2);
  const result = useSpring(70);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>This month</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Track one number</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div
          style={{
            background: COLORS.card,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 36,
            padding: '56px 44px',
            opacity: card,
            transform: `scale(${interpolate(card, [0, 1], [0.92, 1])})`,
          }}
        >
          <Row label="Income" color={COLORS.text} delay={STAGGER * 3} />
          <Row label="− Spending" color={COLORS.muted} delay={STAGGER * 4} />
          <div style={{height: 6, background: COLORS.text, margin: '24px 0', borderRadius: 3}} />
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              color: COLORS.green,
              opacity: result,
              transform: `scale(${interpolate(result, [0, 1], [0.7, 1])})`,
              transformOrigin: 'left center',
            }}
          >
            = ?
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 4}>
        <SourceTag>Educational only · not financial advice</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
