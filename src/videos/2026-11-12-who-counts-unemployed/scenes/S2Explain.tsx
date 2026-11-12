import React from 'react';
import {interpolate} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const NO_JOB_AT = data.scenes[1].captions[1].from; // "no job, available,"
const SEARCH_AT = data.scenes[1].captions[2].from; // "and searched in the past 4 weeks."

const Check: React.FC<{label: string; sub: string; at: number}> = ({label, sub, at}) => {
  const s = useSpring(at);
  const tick = useDraw(at + 8, 14);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        padding: '30px 34px',
        marginBottom: 26,
        borderRadius: 28,
        background: COLORS.card,
        border: `3px solid ${COLORS.border}`,
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [70, 0])}px)`,
      }}
    >
      <svg width={84} height={84} viewBox="0 0 84 84" style={{flexShrink: 0}}>
        <rect x={4} y={4} width={76} height={76} rx={16} fill="none" stroke={COLORS.accent} strokeWidth={6} />
        <path d="M 22 44 L 36 58 L 62 28" fill="none" stroke={COLORS.accent} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" {...drawProps(tick)} />
      </svg>
      <div>
        <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1.05}}>{label}</div>
        <div style={{fontSize: 32, fontWeight: 400, color: COLORS.muted, marginTop: 6}}>{sub}</div>
      </div>
    </div>
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const stamp = useSpring(SEARCH_AT + 34);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The official test</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>All three, or you're out</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Check label="No job" sub="during the survey week" at={NO_JOB_AT} />
        <Check label="Available" sub="could start work" at={NO_JOB_AT + STAGGER * 2} />
        <Check label="Searched" sub="in the past 4 weeks" at={SEARCH_AT} />
        <div
          style={{
            alignSelf: 'center',
            marginTop: 20,
            padding: '18px 40px',
            borderRadius: 18,
            border: `5px solid ${COLORS.green}`,
            color: COLORS.green,
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: 'uppercase',
            opacity: stamp,
            transform: `rotate(-4deg) scale(${interpolate(stamp, [0, 1], [1.4, 1])})`,
          }}
        >
          Counts as unemployed
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>BLS household survey definition (temporary layoffs also count)</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
