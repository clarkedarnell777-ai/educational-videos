import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const REAL = data.scenes[1].captions[1].from; // "Real pay is what it buys."

const Paycheck: React.FC = () => {
  const s = useSpring(STAGGER * 2);
  return (
    <div
      style={{
        width: 440,
        height: 600,
        background: COLORS.card,
        border: `3px solid ${COLORS.accent}`,
        borderRadius: 32,
        padding: 36,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      }}
    >
      <div style={{fontSize: 30, fontWeight: 600, color: COLORS.muted, letterSpacing: 2}}>PAY STUB</div>
      <div>
        <div style={{height: 14, width: '80%', background: COLORS.border, borderRadius: 7, marginBottom: 18}} />
        <div style={{height: 14, width: '60%', background: COLORS.border, borderRadius: 7, marginBottom: 18}} />
        <div style={{height: 14, width: '70%', background: COLORS.border, borderRadius: 7}} />
      </div>
      <div style={{fontSize: 96, fontWeight: 800, color: COLORS.accent}}>$</div>
    </div>
  );
};

const Basket: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = useDraw(REAL, 22);
  const fill = interpolate(frame, [REAL + 18, REAL + 50], [0, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const innerTop = 250;
  const innerBottom = 560;
  const level = innerBottom - (innerBottom - innerTop) * fill;
  return (
    <svg width={440} height={600} viewBox="0 0 440 600" style={{fontFamily: FONT}}>
      <defs>
        <clipPath id="basket-clip">
          <path d="M 40 230 L 400 230 L 360 570 L 80 570 Z" />
        </clipPath>
      </defs>
      <rect x={0} y={level} width={440} height={600} fill={COLORS.green} opacity={0.85} clipPath="url(#basket-clip)" />
      <path d="M 120 230 C 120 90, 320 90, 320 230" fill="none" stroke={COLORS.text} strokeWidth={12} strokeLinecap="round" {...drawProps(draw)} />
      <path d="M 30 230 L 410 230 L 365 575 L 75 575 Z" fill="none" stroke={COLORS.text} strokeWidth={12} strokeLinejoin="round" {...drawProps(draw)} />
      <path d="M 52 330 L 388 330 M 64 440 L 376 440" stroke={COLORS.text} strokeWidth={5} opacity={0.4 * draw} />
    </svg>
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Two kinds of pay</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Nominal vs. real</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
          <Paycheck />
          <Enter delay={STAGGER * 3}>
            <div style={{fontSize: 56, fontWeight: 800, color: COLORS.accent, textAlign: 'center'}}>Nominal</div>
            <div style={{fontSize: 36, fontWeight: 400, color: COLORS.muted, textAlign: 'center'}}>dollars you're paid</div>
          </Enter>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
          <Basket />
          <Enter delay={REAL + STAGGER}>
            <div style={{fontSize: 56, fontWeight: 800, color: COLORS.green, textAlign: 'center'}}>Real</div>
            <div style={{fontSize: 36, fontWeight: 400, color: COLORS.muted, textAlign: 'center'}}>what those dollars buy</div>
          </Enter>
        </div>
      </div>
    </SceneFrame>
  );
};
