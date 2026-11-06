import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {DRAWDOWN_PCT, LAST, RECORD, layout} from './chart';
import type {SceneProps} from './types';

const CORRECTION = data.figures.correctionThresholdPct.value; // 10
const THRESHOLD = RECORD * (1 - CORRECTION / 100); // 24,839.90

// Chart geometry (SVG units = px)
const W = 640;
const H = 760;
const {pts, d, y} = layout(W, H, 23800, 27900);
const fmt = (v: number) => v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const line = useDraw(STAGGER * 2, 60);
  const peak = useSpring(STAGGER * 2);
  const last = useSpring(86); // "Thursday, it ended about 12% below."
  const threshold = useDraw(96, 24);
  const bracket = useDraw(112, 24);
  const first = pts[0];
  const end = pts[pts.length - 1];
  const bx = W + 40; // bracket x
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Nasdaq Composite · daily closes</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Past the 10% line</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
        <svg width={960} height={H + 160} viewBox={`-20 -110 960 ${H + 160}`} style={{fontFamily: FONT}}>
          {/* −10% threshold from the record close */}
          <line
            x1={0}
            y1={y(THRESHOLD)}
            x2={W}
            y2={y(THRESHOLD)}
            stroke={COLORS.accent}
            strokeWidth={4}
            strokeDasharray="14 12"
            opacity={threshold}
          />
          <text x={0} y={y(THRESHOLD) - 16} fontSize={32} fontWeight={600} fill={COLORS.accent} opacity={threshold}>
            −10% = {fmt(THRESHOLD)}
          </text>
          <path d={d} fill="none" stroke={COLORS.text} strokeWidth={7} strokeLinejoin="round" {...drawProps(line)} />
          <g opacity={peak}>
            <circle cx={first.x} cy={first.y} r={16} fill={COLORS.green} />
            <text x={first.x} y={first.y - 70} fontSize={48} fontWeight={800} fill={COLORS.green}>
              {fmt(RECORD)}
            </text>
            <text x={first.x} y={first.y - 30} fontSize={30} fontWeight={600} fill={COLORS.muted}>
              Record close · Oct 6
            </text>
          </g>
          <g opacity={last}>
            <circle cx={end.x} cy={end.y} r={16} fill={COLORS.text} />
            <text x={end.x} y={end.y + 70} textAnchor="end" fontSize={48} fontWeight={800} fill={COLORS.text}>
              {fmt(LAST)}
            </text>
            <text x={end.x} y={end.y + 110} textAnchor="end" fontSize={30} fontWeight={600} fill={COLORS.muted}>
              Close · Nov 5
            </text>
          </g>
          <path
            d={`M ${bx - 20} ${first.y} L ${bx} ${first.y} L ${bx} ${end.y} L ${bx - 20} ${end.y}`}
            fill="none"
            stroke={COLORS.text}
            strokeWidth={5}
            strokeLinecap="round"
            {...drawProps(bracket)}
          />
        </svg>
      </div>
      <div style={{position: 'absolute', right: 0, top: 560, width: 240, textAlign: 'right'}}>
        <Enter delay={120}>
          <div style={{fontSize: 56, fontWeight: 800, color: COLORS.accent}}>
            <CountUp to={DRAWDOWN_PCT} start={120} duration={24} decimals={1} suffix="%" />
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: COLORS.muted,
              lineHeight: 1.2,
              opacity: interpolate(bracket, [0.6, 1], [0, 1], {extrapolateLeft: 'clamp'}),
            }}
          >
            from the record
          </div>
        </Enter>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Nasdaq via FRED · closes Oct 6–Nov 5, 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
