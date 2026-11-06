import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {LAST, RECORD} from './chart';
import type {SceneProps} from './types';

const START = data.figures.exampleStart.value; // $10,000 (illustrative)
const NOW = START * (LAST / RECORD); // $8,809.82 (computed)
const DROP_AT = 128; // "would be about $8,800 now."
const BAR_W = 820;

const money = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const card = useSpring(STAGGER * 2);
  const value = interpolate(frame, [DROP_AT, DROP_AT + 40], [START, NOW], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gone = useSpring(DROP_AT + 44);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Kicker>What it means in dollars</Kicker>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
              padding: '4px 14px',
              borderRadius: 8,
              background: COLORS.green,
              color: COLORS.bg,
            }}
          >
            ILLUSTRATIVE
          </div>
        </div>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Peak to now</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div
          style={{
            background: COLORS.card,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 36,
            padding: '52px 50px',
            opacity: card,
            translate: `0px ${interpolate(card, [0, 1], [50, 0])}px`,
          }}
        >
          <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>Invested at the Oct 6 record close</div>
          <div style={{fontSize: 140, fontWeight: 800, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1}}>
            {money(value)}
          </div>
          <div style={{position: 'relative', width: BAR_W, height: 44, borderRadius: 12, background: '#22222b', marginTop: 20}}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: 44,
                borderRadius: 12,
                width: BAR_W * (value / START),
                background: COLORS.accent,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 44,
              fontWeight: 800,
              opacity: gone,
              translate: `0px ${interpolate(gone, [0, 1], [20, 0])}px`,
            }}
          >
            at the Nov 5 close: <span style={{color: COLORS.accent}}>−{money(START - NOW)}</span>
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Price index only: ignores fees, dividends and taxes. Not a forecast.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
