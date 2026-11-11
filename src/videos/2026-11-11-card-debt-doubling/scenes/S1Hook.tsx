import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {CARD_DOUBLE_YRS, SAVE_DOUBLE_YRS} from './math';
import type {SceneProps} from './types';

const SAVINGS_AT = data.scenes[0].captions[1].from; // "Savings? Over 180 years."
const RACE_START = 30;
const RACE_END = 105; // card balance has doubled
const BAR_W = 960;

// Progress toward "doubled" after CARD_DOUBLE_YRS years, for each rate.
const useYears = () => {
  const frame = useCurrentFrame();
  return interpolate(frame, [RACE_START, RACE_END], [0, CARD_DOUBLE_YRS], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
};

const Track: React.FC<{label: string; progress: number; color: string; right: React.ReactNode}> = ({
  label,
  progress,
  color,
  right,
}) => (
  <div style={{marginBottom: 64}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16}}>
      <span style={{fontSize: 46, fontWeight: 600}}>{label}</span>
      {right}
    </div>
    <div style={{width: BAR_W, height: 120, borderRadius: 24, background: COLORS.card, position: 'relative', overflow: 'hidden'}}>
      <div style={{width: Math.max(progress * BAR_W, 6), height: '100%', borderRadius: 24, background: color}} />
      {/* finish line = balance doubled */}
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, background: COLORS.text, opacity: 0.6}} />
    </div>
  </div>
);

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const years = useYears();
  const cardP = years / CARD_DOUBLE_YRS;
  const saveP = years / SAVE_DOUBLE_YRS;
  const done = useSpring(RACE_END);
  const badge = useSpring(SAVINGS_AT);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Race to double · $5K → $10K</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Your card debt vs. your savings</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Enter delay={STAGGER * 2}>
          <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>Years elapsed</div>
          <div style={{fontSize: 132, fontWeight: 800, lineHeight: 1, marginBottom: 56, fontVariantNumeric: 'tabular-nums'}}>
            {years.toFixed(1)}
          </div>
        </Enter>
        <Enter delay={STAGGER * 2}>
          <Track
            label="Unpaid card balance"
            progress={cardP}
            color={COLORS.accent}
            right={
              <span style={{fontSize: 46, fontWeight: 800, color: COLORS.accent, opacity: done}}>Doubled</span>
            }
          />
        </Enter>
        <Enter delay={STAGGER * 3}>
          <Track
            label="Savings account"
            progress={saveP}
            color={COLORS.green}
            right={
              <span style={{fontSize: 46, fontWeight: 800, color: COLORS.green, fontVariantNumeric: 'tabular-nums'}}>
                {(saveP * 100).toFixed(1)}%
              </span>
            }
          />
        </Enter>
        <div
          style={{
            alignSelf: 'flex-start',
            padding: '20px 36px',
            borderRadius: 999,
            border: `4px solid ${COLORS.green}`,
            background: 'rgba(34,197,94,0.12)',
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.green,
            opacity: badge,
            transform: `scale(${interpolate(badge, [0, 1], [0.8, 1])})`,
            visibility: frame >= SAVINGS_AT ? 'visible' : 'hidden',
          }}
        >
          Savings: ~{Math.round(SAVE_DOUBLE_YRS)} years to double
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Illustrative: monthly compounding, no payments · rates: Fed G.19 Q3 2026, FDIC Oct 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
