import React from 'react';
import {interpolate} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {U3, U6} from './math';
import type {SceneProps} from './types';

const BOTH_AT = 16;
const JUDGE_AT = data.scenes[4].captions[1].from; // "before judging the job market."

const Row: React.FC<{name: string; label: string; value: number; color: string; at: number}> = ({name, label, value, color, at}) => {
  const s = useSpring(at);
  const tick = useDraw(at + 10, 14);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 28, padding: '26px 0', borderTop: `2px solid ${COLORS.border}`, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`}}>
      <svg width={72} height={72} viewBox="0 0 72 72" style={{flexShrink: 0}}>
        <circle cx={36} cy={36} r={32} fill="none" stroke={color} strokeWidth={5} />
        <path d="M 20 37 L 31 48 L 52 25" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" {...drawProps(tick)} />
      </svg>
      <div style={{flex: 1}}>
        <div style={{fontSize: 56, fontWeight: 800}}>{name}</div>
        <div style={{fontSize: 32, color: COLORS.muted}}>{label}</div>
      </div>
      <div style={{fontSize: 64, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums'}}>{value.toFixed(1)}%</div>
    </div>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const card = useSpring(6);
  const note = useSpring(JUDGE_AT);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your takeaway</Kicker>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{padding: '40px 40px 14px', borderRadius: 32, background: COLORS.card, border: `3px solid ${COLORS.accent}`, opacity: card, transform: `scale(${interpolate(card, [0, 1], [0.92, 1])})`}}>
          <div style={{fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginBottom: 24}}>Jobs day checklist</div>
          <Row name="U-3" label="official rate" value={U3} color={COLORS.accent} at={BOTH_AT} />
          <Row name="U-6" label="broader rate" value={U6} color={COLORS.green} at={BOTH_AT + STAGGER} />
        </div>
        <div style={{fontSize: 40, fontWeight: 600, marginTop: 30, color: COLORS.muted, opacity: note}}>Oct 2026 · BLS, seasonally adjusted</div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Educational only, not financial advice.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
