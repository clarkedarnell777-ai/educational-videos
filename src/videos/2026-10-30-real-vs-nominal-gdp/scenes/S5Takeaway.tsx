import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

const Choice: React.FC<{text: string; color: string; delay: number}> = ({text, color, delay}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        flex: 1,
        textAlign: 'center',
        padding: '34px 10px',
        borderRadius: 26,
        border: `3px solid ${color}`,
        color,
        fontSize: 44,
        fontWeight: 800,
        lineHeight: 1.15,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const card = useSpring(STAGGER * 2);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your move</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Seeing a growth number?
        </div>
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
          <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted}}>Ask one question:</div>
          <div style={{fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginTop: 16}}>
            Before or after inflation?
          </div>
          <div style={{display: 'flex', gap: 30, marginTop: 44}}>
            <Choice text="Before = nominal" color={COLORS.accent} delay={84} />
            <Choice text="After = real" color={COLORS.green} delay={94} />
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 4}>
        <SourceTag>Educational only · not financial advice</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
