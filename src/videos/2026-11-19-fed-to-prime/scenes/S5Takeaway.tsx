import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const C = data.scenes[4].captions;
const CHIPS_AT = C[1].from;

const Chip: React.FC<{label: string; delay: number; active: number}> = ({label, delay, active}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        padding: '22px 40px',
        borderRadius: 999,
        fontSize: 44,
        fontWeight: 800,
        border: `4px solid ${COLORS.accent}`,
        background: `rgba(99,102,241,${0.85 * active})`,
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
      }}
    >
      {label}
    </div>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const doc = useSpring(4);
  // highlight alternates between the two chips
  const phase = Math.max(0, frame - CHIPS_AT - 20);
  const a = 0.5 + 0.5 * Math.cos(phase / 10);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your takeaway</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Fixed, or tied to prime?</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36}}>
        <svg width={300} height={360} viewBox="0 0 300 360" style={{opacity: doc, fontFamily: FONT}}>
          <path d="M 30 10 L 210 10 L 270 70 L 270 350 L 30 350 Z" fill={COLORS.card} stroke={COLORS.text} strokeWidth={6} />
          <path d="M 210 10 L 210 70 L 270 70" fill="none" stroke={COLORS.text} strokeWidth={6} />
          {[120, 170, 220, 270].map((y, i) => (
            <rect key={y} x={70} y={y} width={i === 2 ? 110 : 160} height={14} rx={7} fill={i === 2 ? COLORS.green : COLORS.border} />
          ))}
        </svg>
        <div style={{display: 'flex', gap: 30}}>
          <Chip label="Fixed" delay={CHIPS_AT} active={frame > CHIPS_AT + 20 ? a : 0} />
          <Chip label="Tied to prime" delay={CHIPS_AT + STAGGER} active={frame > CHIPS_AT + 20 ? 1 - a : 0} />
        </div>
        <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>Next Fed decision: Dec 9, 2026</div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Educational only, not financial advice.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
