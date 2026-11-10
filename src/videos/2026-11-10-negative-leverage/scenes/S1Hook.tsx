import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import {CAP, CASH_ON_CASH, DOWN_PCT, RATE, pct} from './math';
import type {SceneProps} from './types';

// Year-1 cash return: all cash (= cap rate) vs. with a loan (cash-on-cash).
const W = 900;
const H = 760;
const BASE = 560; // y of the zero line
const PX = 80; // px per percentage point
const BAR_W = 260;
const X_CASH = 120;
const X_LOAN = 520;

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const eraseAt = captions[1].from; // "Right now, it can erase it."
  const axis = useDraw(STAGGER * 2, 20);
  const cash = interpolate(frame, [STAGGER * 3, STAGGER * 3 + 30], [0, CAP], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  // The loan bar first rises like it "should", then falls below zero on "erase it".
  const loan = interpolate(frame, [STAGGER * 5, STAGGER * 5 + 30, eraseAt, eraseAt + 30], [0, CAP, CAP, CASH_ON_CASH], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const cashLabel = useSpring(STAGGER * 3 + 20);
  const loanLabel = useSpring(eraseAt + 24);
  const bar = (x: number, v: number, color: string) => (
    <rect x={x} y={v >= 0 ? BASE - v * PX : BASE} width={BAR_W} height={Math.max(Math.abs(v) * PX, 2)} rx={14} fill={color} />
  );
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Rental math · Nov 2026</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Can a loan make a rental lose money?</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{fontFamily: FONT}}>
          <line x1={60} y1={BASE} x2={W - 40} y2={BASE} stroke={COLORS.muted} strokeWidth={4} {...drawProps(axis)} />
          {bar(X_CASH, cash, COLORS.accent)}
          {bar(X_LOAN, loan, frame >= eraseAt ? COLORS.text : COLORS.green)}
          <text x={X_CASH + BAR_W / 2} y={BASE - CAP * PX - 26} textAnchor="middle" fontSize={64} fontWeight={800} fill={COLORS.text} opacity={cashLabel}>
            {pct(CAP)}
          </text>
          <text x={X_LOAN + BAR_W / 2} y={BASE + 100} textAnchor="middle" fontSize={64} fontWeight={800} fill={COLORS.text} opacity={loanLabel}>
            {pct(CASH_ON_CASH)}
          </text>
          <text x={X_CASH + BAR_W / 2} y={BASE + 170} textAnchor="middle" fontSize={40} fontWeight={600} fill={COLORS.accent}>
            All cash
          </text>
          <text x={X_LOAN + BAR_W / 2} y={BASE + 170} textAnchor="middle" fontSize={40} fontWeight={600} fill={COLORS.green}>
            With a loan
          </text>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>
          Illustrative: year-1 cash return, pre-tax · {DOWN_PCT}% down at {RATE}% (avg 30-yr rate, Freddie Mac)
        </SourceTag>
      </Enter>
    </SceneFrame>
  );
};
