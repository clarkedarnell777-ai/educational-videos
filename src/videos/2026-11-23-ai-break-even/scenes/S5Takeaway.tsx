import React from 'react';
import {interpolate} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const C = data.scenes[4].captions;

const STEPS = [
  {n: 1, text: 'Pick 1 repetitive task', at: C[0].from},
  {n: 2, text: 'Test a tool for 30 days', at: C[1].from},
  {n: 3, text: 'Track hours saved', at: C[2].from},
];

const Step: React.FC<(typeof STEPS)[number]> = ({n, text, at}) => {
  const s = useSpring(at);
  const tick = useDraw(at + 10, 18);
  const done = tick > 0.95;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '30px 34px',
        borderRadius: 26,
        background: COLORS.card,
        border: `3px solid ${done ? COLORS.green : COLORS.border}`,
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`,
      }}
    >
      <svg width={84} height={84} viewBox="0 0 84 84" style={{fontFamily: FONT, flexShrink: 0}}>
        <rect x={4} y={4} width={76} height={76} rx={18} fill={done ? 'rgba(34,197,94,0.2)' : 'none'} stroke={done ? COLORS.green : COLORS.muted} strokeWidth={5} />
        <path d="M 22 44 L 37 58 L 63 28" fill="none" stroke={COLORS.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" {...drawProps(tick)} />
      </svg>
      <div>
        <div style={{fontSize: 30, fontWeight: 800, color: COLORS.accent, letterSpacing: 3}}>STEP {n}</div>
        <div style={{fontSize: 48, fontWeight: 800, marginTop: 4}}>{text}</div>
      </div>
    </div>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your takeaway</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Make AI <span style={{color: COLORS.green}}>prove it</span> pays
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34}}>
        {STEPS.map((s) => (
          <Step key={s.n} {...s} />
        ))}
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Educational only, not financial advice.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
