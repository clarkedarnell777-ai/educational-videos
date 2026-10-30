import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {drawProps, CountUp, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const NOMINAL = data.figures.nominalGdp.value; // 5.6
const REAL = data.figures.realGdp.value; // 3.4
const GAP = Math.round((NOMINAL - REAL) * 10) / 10; // 2.2 (computed)

// Chart geometry (SVG units = px)
const W = 960;
const H = 860;
const BASE = 760; // y of the x-axis
const SCALE = 120; // px per percentage point (6% → 720px)
const BAR_W = 230;
const X_NOM = 150;
const X_REAL = 470;

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  // Labels count up with interpolate() so they always land exactly on the sourced value.
  const grow = (to: number, start: number) =>
    interpolate(frame, [start, start + 30], [0, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  const count = (to: number, start: number) => grow(to, start).toFixed(1);
  const axis = useDraw(STAGGER, 20);
  const nom = useSpring(STAGGER * 2);
  const real = useSpring(128); // "real 3.4%" caption
  const bracket = useDraw(156, 24); // "The gap was mostly higher prices."
  const gapLabel = useSpring(170);

  // Bars grow in step with their count-up labels and land exactly on scale.
  const nomH = grow(NOMINAL, STAGGER * 2) * SCALE;
  const realH = grow(REAL, 128) * SCALE;
  const yNom = BASE - NOMINAL * SCALE;
  const yReal = BASE - REAL * SCALE;
  const bx = X_REAL + BAR_W + 40; // bracket x

  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Q3 2026 · annual rate</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          The gap is prices
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{fontFamily: FONT}}>
          <line x1={40} y1={BASE} x2={W - 40} y2={BASE} stroke={COLORS.muted} strokeWidth={4} {...drawProps(axis)} />
          {/* guide line at the real level */}
          <line
            x1={X_NOM}
            y1={yReal}
            x2={bx}
            y2={yReal}
            stroke={COLORS.green}
            strokeWidth={3}
            strokeDasharray="10 10"
            opacity={0.6 * gapLabel}
          />
          <rect x={X_NOM} y={BASE - nomH} width={BAR_W} height={nomH} rx={16} fill={COLORS.accent} />
          <rect x={X_REAL} y={BASE - realH} width={BAR_W} height={realH} rx={16} fill={COLORS.green} />
          <text x={X_NOM + BAR_W / 2} y={BASE - nomH - 24} textAnchor="middle" fontSize={72} fontWeight={800} fill={COLORS.text} opacity={nom}>
            {count(NOMINAL, STAGGER * 2)}%
          </text>
          <text x={X_REAL + BAR_W / 2} y={BASE - realH - 24} textAnchor="middle" fontSize={72} fontWeight={800} fill={COLORS.text} opacity={real}>
            {count(REAL, 128)}%
          </text>
          <text x={X_NOM + BAR_W / 2} y={BASE + 56} textAnchor="middle" fontSize={40} fontWeight={600} fill={COLORS.accent}>
            Nominal
          </text>
          <text x={X_REAL + BAR_W / 2} y={BASE + 56} textAnchor="middle" fontSize={40} fontWeight={600} fill={COLORS.green}>
            Real
          </text>
          {/* bracket spanning the gap between the two levels */}
          <path
            d={`M ${bx - 20} ${yNom} L ${bx} ${yNom} L ${bx} ${yReal} L ${bx - 20} ${yReal}`}
            fill="none"
            stroke={COLORS.text}
            strokeWidth={5}
            strokeLinecap="round"
            {...drawProps(bracket)}
          />
          <line x1={X_NOM + BAR_W} y1={yNom} x2={bx - 20} y2={yNom} stroke={COLORS.accent} strokeWidth={3} strokeDasharray="10 10" opacity={0.6 * gapLabel} />
        </svg>
      </div>
      <div style={{position: 'absolute', right: 0, top: 450, width: 190}}>
        <Enter delay={170}>
          <div style={{fontSize: 64, fontWeight: 800, color: COLORS.text}}>
            <CountUp to={GAP} start={170} duration={24} decimals={1} />
          </div>
          <div style={{fontSize: 30, fontWeight: 600, color: COLORS.muted, lineHeight: 1.2}}>
            pts, mostly higher prices
          </div>
        </Enter>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>BEA advance estimate, Oct 29, 2026 · Q3 (Jul–Sep) · revised Nov 25</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
