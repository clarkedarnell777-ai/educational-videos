import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

// Conceptual diagram (no data): a "Nominal" stack of spending whose
// price-increase layer peels away, leaving the "Real" bar.
const BAR_W = 300;
const REAL_H = 440;
const PRICE_H = 230;

const Coin: React.FC<{delay: number; y: number}> = ({delay, y}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: y,
        width: BAR_W,
        height: 54,
        borderRadius: 14,
        background: COLORS.green,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [-60, 0])}px)`,
        boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.25)',
      }}
    />
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const priceIn = useSpring(STAGGER * 7);
  const peel = useSpring(105); // matches the "Real GDP removes price increases" caption
  const realLabel = useSpring(115);
  const coins = [0, 1, 2, 3, 4, 5, 6];
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
      <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 60}}>
        <div style={{position: 'relative', width: BAR_W, height: REAL_H + PRICE_H}}>
          {coins.map((i) => (
            <Coin key={i} delay={STAGGER * 2 + i * 4} y={i * 63} />
          ))}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: REAL_H,
              width: BAR_W,
              height: PRICE_H - 10,
              borderRadius: 18,
              background: 'rgba(99,102,241,0.35)',
              border: `3px dashed ${COLORS.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 600,
              textAlign: 'center',
              opacity: priceIn * interpolate(peel, [0, 1], [1, 0]),
              transform: `translate(${interpolate(peel, [0, 1], [0, 240])}px, ${interpolate(
                peel,
                [0, 1],
                [0, -80],
              )}px) rotate(${interpolate(peel, [0, 1], [0, 12])}deg)`,
            }}
          >
            Price
            <br />
            increases
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 40, paddingBottom: 20, width: 460}}>
          <Enter delay={STAGGER * 3}>
            <div style={{fontSize: 56, fontWeight: 800, color: COLORS.accent}}>Nominal</div>
            <div style={{fontSize: 36, color: COLORS.text, lineHeight: 1.25}}>
              spending in today&apos;s dollars
            </div>
          </Enter>
          <div
            style={{
              opacity: realLabel,
              transform: `translateY(${interpolate(realLabel, [0, 1], [40, 0])}px)`,
            }}
          >
            <div style={{fontSize: 56, fontWeight: 800, color: COLORS.green}}>Real</div>
            <div style={{fontSize: 36, color: COLORS.text, lineHeight: 1.25}}>
              same spending, price increases removed
            </div>
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 4} style={{marginTop: 30}}>
        <SourceTag>Concept diagram · not to scale</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
