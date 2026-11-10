import React from 'react';
import {interpolate} from 'remotion';
import {Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import {CAP, NOI, PRICE, pct, usd} from './math';
import type {SceneProps} from './types';

const Term: React.FC<{progress: number; color: string; children: React.ReactNode; note?: string}> = ({
  progress,
  color,
  children,
  note,
}) => (
  <div style={{textAlign: 'center', opacity: progress, translate: `0px ${interpolate(progress, [0, 1], [30, 0])}px`}}>
    <div style={{fontSize: 68, fontWeight: 800, color, lineHeight: 1.1}}>{children}</div>
    {note ? <div style={{fontSize: 36, fontWeight: 400, color: COLORS.muted, marginTop: 8}}>{note}</div> : null}
  </div>
);

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const priceAt = captions[1].from; // "divided by the price."
  const card = useSpring(STAGGER);
  const numerator = useSpring(STAGGER * 2);
  const bar = useDraw(STAGGER * 4, 20);
  const denominator = useSpring(priceAt);
  const example = useSpring(priceAt + 16);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The property's number</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Cap rate</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 44}}>
        <div
          style={{
            background: COLORS.card,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 36,
            padding: '56px 40px',
            opacity: card,
            scale: interpolate(card, [0, 1], [0.94, 1]),
          }}
        >
          <Term progress={numerator} color={COLORS.green} note="rent minus operating costs (NOI)">
            Yearly income
          </Term>
          <svg width="100%" height={40} viewBox="0 0 880 40" preserveAspectRatio="none" style={{margin: '26px 0'}}>
            <line x1={0} y1={20} x2={880} y2={20} stroke={COLORS.text} strokeWidth={8} strokeLinecap="round" {...drawProps(bar)} />
          </svg>
          <Term progress={denominator} color={COLORS.accent}>
            Price
          </Term>
        </div>
        <div
          style={{
            alignSelf: 'center',
            padding: '20px 36px',
            borderRadius: 999,
            border: `2px solid ${COLORS.border}`,
            fontSize: 48,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            opacity: example,
            translate: `0px ${interpolate(example, [0, 1], [24, 0])}px`,
          }}
        >
          {usd(NOI)} ÷ {usd(PRICE)} = <span style={{color: COLORS.green}}>{pct(CAP, 0)}</span>
        </div>
      </div>
      <Enter delay={STAGGER * 4}>
        <SourceTag>Example rental is illustrative · NOI is before mortgage payments</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
