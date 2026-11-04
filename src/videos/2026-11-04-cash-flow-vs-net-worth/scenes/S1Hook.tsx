import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const NET_WORTH = data.figures.medianNetWorth.value; // 215,900
const BILL = 52;

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const bill = useSpring(BILL);
  const stamp = useSpring(BILL + 22);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Net worth</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 148, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          <CountUp to={NET_WORTH} start={STAGGER} duration={36} prefix="$" />
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            position: 'relative',
            width: 760,
            padding: '48px 52px',
            borderRadius: 28,
            background: COLORS.muted,
            color: COLORS.bg,
            opacity: bill,
            transform: `translateX(${interpolate(bill, [0, 1], [500, 0])}px) rotate(-2deg)`,
          }}
        >
          <div style={{fontSize: 60, fontWeight: 800}}>Electric bill</div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{height: 16, width: 600 - i * 120, background: COLORS.bg, opacity: 0.3, borderRadius: 8, marginTop: 28}}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              right: 36,
              bottom: 28,
              padding: '6px 26px',
              border: `8px solid ${COLORS.bg}`,
              borderRadius: 16,
              fontSize: 76,
              fontWeight: 800,
              opacity: stamp,
              transform: `rotate(-10deg) scale(${interpolate(stamp, [0, 1], [1.5, 1])})`,
            }}
          >
            DUE
          </div>
        </div>
      </div>
      <Enter delay={BILL + 30}>
        <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 18}}>
          Net worth can't pay this.
          <br />
          <span style={{color: COLORS.green}}>Cash does.</span>
        </div>
      </Enter>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Median family net worth, 2025 · Fed SCF</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
