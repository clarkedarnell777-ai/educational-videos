import React from 'react';
import {interpolate} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const FIND_AT = data.scenes[4].captions[1].from; // "find your highest-rate balance and pay it down first."

const Step: React.FC<{n: number; text: string; at: number}> = ({n, text, at}) => {
  const s = useSpring(at);
  const check = useDraw(at + 14, 16);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '34px 32px',
        borderRadius: 28,
        background: COLORS.card,
        border: `3px solid ${COLORS.border}`,
        marginBottom: 28,
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-50, 0])}px)`,
      }}
    >
      <svg width={72} height={72} viewBox="0 0 72 72" style={{flexShrink: 0}}>
        <circle cx={36} cy={36} r={32} fill="none" stroke={COLORS.green} strokeWidth={5} />
        <path d="M 20 37 L 31 48 L 52 25" fill="none" stroke={COLORS.green} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" {...drawProps(check)} />
      </svg>
      <div>
        <div style={{fontSize: 30, fontWeight: 600, color: COLORS.muted}}>Step {n}</div>
        <div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.1}}>{text}</div>
      </div>
    </div>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your move</Kicker>
      </Enter>
      <Enter delay={STAGGER / 2}>
        <div style={{fontSize: 88, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Flip the snowball</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Step n={1} text="Find your highest-rate balance" at={FIND_AT} />
        <Step n={2} text="Pay it down first" at={FIND_AT + STAGGER * 3} />
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Educational only · not financial advice</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
