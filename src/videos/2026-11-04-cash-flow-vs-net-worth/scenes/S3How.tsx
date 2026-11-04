import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {drawProps, CountUp, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const EQUITY = data.figures.medianHomeEquity.value; // 230,000
const IN = data.figures.exampleIncome.value; // 6,500
const OUT = data.figures.exampleSpending.value; // 6,800
const GAP = IN - OUT; // -300 (computed)

const MONTHLY = 76; // "but overspend 300 dollars monthly"
const PX = 760 / OUT; // shared scale for both bars

const Bar: React.FC<{label: string; value: number; color: string; delay: number}> = ({label, value, color, delay}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 26], [0, value * PX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const s = useSpring(delay);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: s}}>
      <div style={{width: 80, fontSize: 40, fontWeight: 800, color}}>{label}</div>
      <div
        style={{
          width: w,
          height: 96,
          borderRadius: 14,
          background: color,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          boxSizing: 'border-box',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: 48,
          fontWeight: 800,
          color: COLORS.bg,
        }}
      >
        ${value.toLocaleString('en-US')}
      </div>
    </div>
  );
};

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const house = useDraw(STAGGER, 30);
  const fill = interpolate(frame, [STAGGER * 2, STAGGER * 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const badge = useSpring(MONTHLY + 34);
  const bottom = 320;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Illustrative</Kicker>
      </Enter>
      <div style={{display: 'flex', alignItems: 'center', gap: 34, marginTop: 24}}>
        <svg width={360} height={360} viewBox="0 0 360 360" style={{fontFamily: FONT, flexShrink: 0}}>
          <defs>
            <clipPath id="cf-house">
              <path d="M 180 30 L 340 170 L 300 170 L 300 330 L 60 330 L 60 170 L 20 170 Z" />
            </clipPath>
          </defs>
          <rect
            x={0}
            y={bottom + 10 - 300 * fill}
            width={360}
            height={300 * fill + 10}
            fill={COLORS.accent}
            clipPath="url(#cf-house)"
          />
          <path
            d="M 180 30 L 340 170 L 300 170 L 300 330 L 60 330 L 60 170 L 20 170 Z"
            fill="none"
            stroke={COLORS.text}
            strokeWidth={10}
            strokeLinejoin="round"
            {...drawProps(house)}
          />
        </svg>
        <div>
          <div style={{fontSize: 92, fontWeight: 800, lineHeight: 1.05}}>
            <CountUp to={EQUITY} start={STAGGER * 2} duration={40} prefix="$" />
          </div>
          <div style={{fontSize: 44, fontWeight: 600, color: COLORS.muted}}>home equity</div>
        </div>
      </div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26}}>
        <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted}}>Every month</div>
        <Bar label="In" value={IN} color={COLORS.green} delay={MONTHLY} />
        <Bar label="Out" value={OUT} color={COLORS.muted} delay={MONTHLY + STAGGER} />
        <div
          style={{
            alignSelf: 'flex-end',
            marginTop: 14,
            padding: '16px 34px',
            borderRadius: 22,
            border: `4px solid ${COLORS.text}`,
            fontSize: 72,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            opacity: badge,
            transform: `scale(${interpolate(badge, [0, 1], [0.7, 1])})`,
          }}
        >
          −${Math.abs(GAP)}/mo
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Equity: median among homeowners, Fed SCF 2025. Monthly figures illustrative.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
