import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const card = useSpring(STAGGER * 2);
  const question = useSpring(captions[1].from); // "when will I actually need this money?"
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Before reacting</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Ask one question</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div
          style={{
            background: COLORS.card,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 36,
            padding: '64px 48px',
            opacity: card,
            scale: interpolate(card, [0, 1], [0.92, 1]),
          }}
        >
          <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted}}>Start with your time horizon:</div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.08,
              marginTop: 24,
              opacity: question,
              translate: `0px ${interpolate(question, [0, 1], [30, 0])}px`,
            }}
          >
            When will I <span style={{color: COLORS.green}}>need</span> this money?
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 4}>
        <SourceTag>Educational only · not financial advice</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
