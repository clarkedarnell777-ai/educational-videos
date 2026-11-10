import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import {CAP, CASH_FLOW, DEBT_SERVICE, DOWN, DOWN_PCT, NOI, PRICE, pct, usd} from './math';
import type {SceneProps} from './types';

// Cash waterfall: NOI in, loan payments out, what's left (drawn to one dollar scale).
const W = 940;
const H = 780;
const TOP = 90;
const PX_PER_USD = 520 / NOI;
const BAR_W = 220;
const COLS = [40, 360, 680];

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const downAt = captions[1].from; // "bought with 25% down,"
  const lossAt = captions[2].from; // "loses about $290 a year."
  const grow = (start: number) =>
    interpolate(frame, [start, start + 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const income = grow(STAGGER * 3);
  const payments = grow(downAt + STAGGER);
  const result = useSpring(lossAt);
  const link = useDraw(lossAt, 20);
  const baseY = TOP + NOI * PX_PER_USD; // bottom of the income bar = zero line for the result
  const incomeH = NOI * PX_PER_USD * income;
  const payH = DEBT_SERVICE * PX_PER_USD * payments;
  const lossH = Math.abs(CASH_FLOW) * PX_PER_USD;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Kicker>Year 1, before taxes</Kicker>
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
        <div style={{fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginTop: 14}}>
          {usd(PRICE)} rental
          <div style={{fontSize: 48, fontWeight: 600, color: COLORS.muted}}>
            {pct(CAP, 0)} cap rate · {DOWN_PCT}% down
          </div>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{fontFamily: FONT}}>
          {/* Income: rises from the zero line */}
          <rect x={COLS[0]} y={baseY - incomeH} width={BAR_W} height={incomeH} rx={14} fill={COLORS.green} />
          {/* Loan payments: hang down from the top of income */}
          <rect x={COLS[1]} y={baseY - NOI * PX_PER_USD} width={BAR_W} height={payH} rx={14} fill={COLORS.accent} />
          <line
            x1={COLS[1] + BAR_W}
            y1={baseY}
            x2={COLS[2]}
            y2={baseY}
            stroke={COLORS.muted}
            strokeWidth={3}
            strokeDasharray="10 8"
            opacity={link}
          />
          {/* What's left: a sliver below zero */}
          <rect x={COLS[2]} y={baseY} width={BAR_W} height={Math.max(lossH * result, 1)} rx={4} fill={COLORS.text} />
          <text x={COLS[0] + BAR_W / 2} y={TOP - 30} textAnchor="middle" fontSize={48} fontWeight={800} fill={COLORS.green} opacity={income}>
            +{usd(NOI)}
          </text>
          <text x={COLS[1] + BAR_W / 2} y={TOP - 30} textAnchor="middle" fontSize={48} fontWeight={800} fill={COLORS.accent} opacity={payments}>
            −{usd(DEBT_SERVICE)}
          </text>
          <text x={COLS[2] + BAR_W / 2} y={baseY - 30} textAnchor="middle" fontSize={64} fontWeight={800} fill={COLORS.text} opacity={result}>
            {usd(CASH_FLOW)}
          </text>
          <text x={COLS[0] + BAR_W / 2} y={baseY + 70} textAnchor="middle" fontSize={34} fontWeight={600} fill={COLORS.muted}>
            Income (NOI)
          </text>
          <text x={COLS[1] + BAR_W / 2} y={baseY + 70} textAnchor="middle" fontSize={34} fontWeight={600} fill={COLORS.muted} opacity={payments}>
            Loan payments
          </text>
          <text x={COLS[2] + BAR_W / 2} y={baseY + 70} textAnchor="middle" fontSize={34} fontWeight={600} fill={COLORS.muted} opacity={result}>
            Cash flow
          </text>
          <text x={COLS[2] + BAR_W / 2} y={baseY + 112} textAnchor="middle" fontSize={30} fontWeight={400} fill={COLORS.muted} opacity={result}>
            on {usd(DOWN)} down
          </text>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Pre-tax cash flow only: ignores closing costs, principal paydown and appreciation. Not a forecast.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
