import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const OLD = data.figures.coverageOld.value; // 1.15
const NEW = data.figures.coverageNew.value; // 1.25

// Gauge scale: 1.00x (left) to 1.50x (right) across a half circle.
const CX = 480;
const CY = 400;
const R = 340;
const angleFor = (v: number) => Math.PI * (1 - (v - 1) / 0.5);
const pt = (v: number, r: number) => ({
  x: CX + r * Math.cos(angleFor(v)),
  y: CY - r * Math.sin(angleFor(v)),
});

const Basis: React.FC<{label: string; ok: boolean; delay: number}> = ({label, ok, delay}) => {
  const s = useSpring(delay);
  const color = ok ? COLORS.green : COLORS.muted;
  return (
    <div
      style={{
        flex: 1,
        padding: '30px 12px',
        borderRadius: 26,
        textAlign: 'center',
        fontSize: 44,
        fontWeight: 800,
        color,
        border: `3px solid ${ok ? COLORS.green : COLORS.border}`,
        background: ok ? 'rgba(34,197,94,0.1)' : COLORS.card,
        opacity: s * (ok ? 1 : 0.55),
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
        textDecoration: ok ? 'none' : 'line-through',
      }}
    >
      {label}
    </div>
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const arc = useDraw(STAGGER, 30);
  const value = interpolate(frame, [46, 84], [OLD, NEW], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const tip = pt(value, R - 60);
  const start = pt(1, R);
  const end = pt(1.5, R);
  const mark = pt(OLD, R + 48);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Effective Oct 1, 2026</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          The bar went up
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26}}>
        <svg width={960} height={590} viewBox="0 0 960 590" style={{fontFamily: FONT}}>
          <path
            d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
            fill="none"
            stroke={COLORS.border}
            strokeWidth={34}
            strokeLinecap="round"
            {...drawProps(arc)}
          />
          <text x={mark.x} y={mark.y} textAnchor="middle" fontSize={34} fontWeight={600} fill={COLORS.muted}>
            {OLD.toFixed(2)}x
          </text>
          <line x1={CX} y1={CY} x2={tip.x} y2={tip.y} stroke={COLORS.green} strokeWidth={14} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={24} fill={COLORS.green} />
          <text
            x={CX}
            y={CY + 122}
            textAnchor="middle"
            fontSize={104}
            fontWeight={800}
            fill={COLORS.text}
            style={{fontVariantNumeric: 'tabular-nums'}}
          >
            {value.toFixed(2)}x
          </text>
          <text x={CX} y={CY + 178} textAnchor="middle" fontSize={36} fontWeight={600} fill={COLORS.muted}>
            minimum debt coverage
          </text>
        </svg>
        <div style={{display: 'flex', gap: 28}}>
          <Basis label="Past earnings" ok delay={136} />
          <Basis label="Forecasts" ok={false} delay={146} />
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Initial acquisitions, owner buyouts · Starfield & Smith, Sep 9, 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
