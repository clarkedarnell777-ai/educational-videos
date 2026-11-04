import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {drawProps, CountUp, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const PAYMENTS = data.figures.examplePayments.value; // 100
const EARNINGS = PAYMENTS * data.figures.coverageNew.value; // 125 (computed)
const EXTRA = EARNINGS - PAYMENTS; // 25 (computed)

const PX = 6; // px per dollar, shared by both bars
const X0 = 40;
const SECOND = 96; // "needs $125 of earnings"

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const grow = (to: number, start: number) =>
    interpolate(frame, [start, start + 30], [0, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  const bracket = useDraw(SECOND + 30, 20);
  const extra = useSpring(SECOND + 40);
  const xPay = X0 + PAYMENTS * PX;
  const xEarn = X0 + EARNINGS * PX;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Illustrative</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          What 1.25x means
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={760} viewBox="0 0 960 760" style={{fontFamily: FONT}}>
          <text x={X0} y={80} fontSize={44} fontWeight={600} fill={COLORS.text}>
            Loan payments
          </text>
          <rect x={X0} y={110} width={grow(PAYMENTS, 14) * PX} height={150} rx={18} fill={COLORS.accent} />
          <text x={X0 + 30} y={208} fontSize={72} fontWeight={800} fill={COLORS.text} style={{fontVariantNumeric: 'tabular-nums'}}>
            ${grow(PAYMENTS, 14).toFixed(0)}
          </text>
          <g opacity={interpolate(frame, [SECOND - 4, SECOND + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
            <text x={X0} y={350} fontSize={44} fontWeight={600} fill={COLORS.text}>
              Earnings needed
            </text>
          </g>
          <rect x={X0} y={380} width={grow(EARNINGS, SECOND) * PX} height={150} rx={18} fill={COLORS.green} />
          <text
            x={X0 + 30}
            y={478}
            fontSize={72}
            fontWeight={800}
            fill={COLORS.bg}
            opacity={frame > SECOND ? 1 : 0}
            style={{fontVariantNumeric: 'tabular-nums'}}
          >
            ${grow(EARNINGS, SECOND).toFixed(0)}
          </text>
          <line x1={xPay} y1={270} x2={xPay} y2={560} stroke={COLORS.text} strokeWidth={4} strokeDasharray="10 10" opacity={extra * 0.7} />
          <path
            d={`M ${xPay} 580 L ${xPay} 600 L ${xEarn} 600 L ${xEarn} 580`}
            fill="none"
            stroke={COLORS.text}
            strokeWidth={5}
            strokeLinecap="round"
            {...drawProps(bracket)}
          />
        </svg>
      </div>
      <div style={{position: 'absolute', right: 0, top: 930, width: 480, textAlign: 'right'}}>
        <Enter delay={SECOND + 40}>
          <div style={{fontSize: 64, fontWeight: 800, color: COLORS.green}}>
            +<CountUp to={EXTRA} start={SECOND + 40} duration={20} prefix="$" />
          </div>
          <div style={{fontSize: 34, fontWeight: 600, color: COLORS.muted}}>cushion on every $100</div>
        </Enter>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Simplified math · "earnings" stands in for EBITDA-style cash flow</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
