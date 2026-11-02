import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

// Conceptual diagram (no data): two bars side by side. "Nominal" is a stack of
// spending plus a price-increase layer; "Real" is the same stack with that
// layer removed (left as a dashed outline).
const BAR_W = 300;
const COIN_H = 62;
const COIN_GAP = 14;
const COINS = 7;
const STACK_H = COINS * (COIN_H + COIN_GAP);
const PRICE_H = 250;

const Coin: React.FC<{delay: number; y: number}> = ({delay, y}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: y,
        width: BAR_W,
        height: COIN_H,
        borderRadius: 14,
        background: COLORS.green,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [-60, 0])}px)`,
        boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.25)',
      }}
    />
  );
};

const PriceLayer: React.FC<{progress: number; ghost?: boolean}> = ({progress, ghost}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      bottom: STACK_H,
      width: BAR_W,
      height: PRICE_H,
      borderRadius: 18,
      background: ghost ? 'transparent' : 'rgba(99,102,241,0.35)',
      border: `3px dashed ${ghost ? COLORS.muted : COLORS.accent}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 36,
      fontWeight: 600,
      textAlign: 'center',
      color: ghost ? COLORS.muted : COLORS.text,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [-40, 0])}px)`,
    }}
  >
    {ghost ? (
      <>
        Price increases
        <br />
        removed
      </>
    ) : (
      <>
        Price
        <br />
        increases
      </>
    )}
  </div>
);

const Column: React.FC<{
  title: string;
  subtitle: string;
  color: string;
  labelIn: number;
  children: React.ReactNode;
}> = ({title, subtitle, color, labelIn, children}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: BAR_W}}>
    <div style={{position: 'relative', width: BAR_W, height: STACK_H + PRICE_H}}>{children}</div>
    <div
      style={{
        marginTop: 28,
        textAlign: 'center',
        opacity: labelIn,
        transform: `translateY(${interpolate(labelIn, [0, 1], [30, 0])}px)`,
      }}
    >
      <div style={{fontSize: 56, fontWeight: 800, color}}>{title}</div>
      <div style={{fontSize: 36, color: COLORS.text, lineHeight: 1.25}}>{subtitle}</div>
    </div>
  </div>
);

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const coins = Array.from({length: COINS}, (_, i) => i);
  const nominalLabel = useSpring(STAGGER * 3);
  const priceIn = useSpring(STAGGER * 7);
  // Real bar builds on the "Real GDP removes price increases" caption (frame 105).
  const REAL_IN = 105;
  const realLabel = useSpring(REAL_IN + 10);
  const ghostIn = useSpring(REAL_IN + STAGGER * 3);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Two ways to measure</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Nominal vs. Real
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 120}}>
        <Column title="Nominal" subtitle="today's dollars" color={COLORS.accent} labelIn={nominalLabel}>
          {coins.map((i) => (
            <Coin key={i} delay={STAGGER * 2 + i * 4} y={i * (COIN_H + COIN_GAP)} />
          ))}
          <PriceLayer progress={priceIn} />
        </Column>
        <Column title="Real" subtitle="prices removed" color={COLORS.green} labelIn={realLabel}>
          {coins.map((i) => (
            <Coin key={i} delay={REAL_IN + i * 3} y={i * (COIN_H + COIN_GAP)} />
          ))}
          <PriceLayer progress={ghostIn} ghost />
        </Column>
      </div>
      <Enter delay={STAGGER * 4} style={{marginTop: 30}}>
        <SourceTag>Concept diagram · not to scale</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
