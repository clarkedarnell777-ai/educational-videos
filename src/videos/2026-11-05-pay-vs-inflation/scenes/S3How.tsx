import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const PAY = data.figures.wageGrowth.value; // 3.0
const PRICES = data.figures.cpiGrowth.value; // 3.7
const REAL = data.figures.realHourly.value; // -0.7 (BLS)
const [, PRICES_AT, FELL_AT] = data.scenes[2].captions.map((c) => c.from);
const PAY_AT = 20;

const BASE = 700; // y of 0%
const PX = 150; // px per percentage point
const W = 280;
const X_PAY = 140;
const X_PRICE = 540;

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const grow = (to: number, start: number) =>
    interpolate(frame, [start, start + 30], [0, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  const pay = grow(PAY, PAY_AT);
  const prices = grow(PRICES, PRICES_AT);
  const guide = useDraw(FELL_AT - 6, 16);
  const bracket = useDraw(FELL_AT, 18);
  const gap = useSpring(FELL_AT + 10);
  const yPay = BASE - PAY * PX;
  const yPrice = BASE - PRICES * PX;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>How it works</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Raise minus inflation = real pay
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={820} viewBox="0 0 960 820" style={{fontFamily: FONT}}>
          <line x1={60} y1={BASE} x2={900} y2={BASE} stroke={COLORS.muted} strokeWidth={4} />
          <rect x={X_PAY} y={BASE - pay * PX} width={W} height={pay * PX} rx={16} fill={COLORS.green} />
          <rect x={X_PRICE} y={BASE - prices * PX} width={W} height={prices * PX} rx={16} fill={COLORS.text} />
          <text x={X_PAY + W / 2} y={BASE - pay * PX - 24} textAnchor="middle" fontSize={64} fontWeight={800} fill={COLORS.green} opacity={pay > 0.3 ? 1 : 0} style={{fontVariantNumeric: 'tabular-nums'}}>
            +{pay.toFixed(1)}%
          </text>
          <text x={X_PRICE + W / 2} y={BASE - prices * PX - 24} textAnchor="middle" fontSize={64} fontWeight={800} fill={COLORS.text} opacity={prices > 0.3 ? 1 : 0} style={{fontVariantNumeric: 'tabular-nums'}}>
            +{prices.toFixed(1)}%
          </text>
          <text x={X_PAY + W / 2} y={BASE + 60} textAnchor="middle" fontSize={44} fontWeight={600} fill={COLORS.text}>Hourly pay</text>
          <text x={X_PRICE + W / 2} y={BASE + 60} textAnchor="middle" fontSize={44} fontWeight={600} fill={COLORS.text} opacity={frame >= PRICES_AT ? 1 : 0}>
            Prices
          </text>
          {/* dashed guide from top of pay bar across to the price bar */}
          <path d={`M ${X_PAY} ${yPay} L ${X_PRICE + W + 30} ${yPay}`} fill="none" stroke={COLORS.accent} strokeWidth={4} strokeDasharray="12 10" opacity={guide} />
          <path
            d={`M ${X_PRICE + W + 20} ${yPrice} L ${X_PRICE + W + 44} ${yPrice} L ${X_PRICE + W + 44} ${yPay} L ${X_PRICE + W + 20} ${yPay}`}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={8}
            strokeLinecap="round"
            {...drawProps(bracket)}
          />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 0, top: 290, opacity: gap, transform: `translateY(${interpolate(gap, [0, 1], [24, 0])}px)`}}>
        <div style={{fontSize: 34, fontWeight: 600, color: COLORS.muted}}>Real hourly pay</div>
        <div style={{fontSize: 96, fontWeight: 800, color: COLORS.accent, fontVariantNumeric: 'tabular-nums'}}>
          {REAL.toFixed(1)}%
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>BLS Real Earnings, Sep 2026 (released Oct 14, 2026) · year over year</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
