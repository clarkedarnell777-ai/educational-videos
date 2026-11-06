import React from 'react';
import {Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

// Concept chart (no data): x = sales volume, y = dollars.
// Fixed costs are flat; total cost = fixed + per-sale cost; revenue rises faster.
const W = 900;
const H = 820;
const L = 70; // y-axis x
const B = H - 70; // x-axis y
const FIXED_Y = B - 260;
const COST_SLOPE = 0.35;
const REV_SLOPE = 0.9;
const X_END = W - 210; // labels sit in the column to the right of the lines
const LABEL_X = X_END + 16;
// Break-even where revenue meets total cost: REV_SLOPE·dx = 260 + COST_SLOPE·dx
const BE_DX = 260 / (REV_SLOPE - COST_SLOPE);
const BE_X = L + BE_DX;
const BE_Y = B - REV_SLOPE * BE_DX;

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const axes = useDraw(STAGGER, 20);
  const fixed = useDraw(STAGGER * 2, 24);
  const cost = useDraw(STAGGER * 4, 30);
  const coverAt = captions[1].from; // "where sales cover every cost."
  const revenue = useDraw(coverAt, 36);
  const point = useSpring(coverAt + 34);
  const dx = X_END - L;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The first number to know</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Break-even</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{fontFamily: FONT}}>
          <path d={`M ${L} 20 L ${L} ${B} L ${X_END} ${B}`} fill="none" stroke={COLORS.muted} strokeWidth={4} {...drawProps(axes)} />
          <text x={X_END} y={B + 52} textAnchor="end" fontSize={32} fontWeight={600} fill={COLORS.muted}>
            Sales →
          </text>
          <line x1={L} y1={FIXED_Y} x2={X_END} y2={FIXED_Y} stroke={COLORS.muted} strokeWidth={5} strokeDasharray="12 10" opacity={fixed} />
          <text x={LABEL_X} y={FIXED_Y + 12} fontSize={32} fontWeight={600} fill={COLORS.muted} opacity={fixed}>
            Fixed costs
          </text>
          <line x1={L} y1={FIXED_Y} x2={X_END} y2={FIXED_Y - COST_SLOPE * dx} stroke={COLORS.accent} strokeWidth={7} {...drawProps(cost)} />
          <text x={LABEL_X} y={FIXED_Y - COST_SLOPE * dx + 12} fontSize={36} fontWeight={800} fill={COLORS.accent} opacity={cost}>
            Total cost
          </text>
          <line x1={L} y1={B} x2={X_END} y2={B - REV_SLOPE * dx} stroke={COLORS.green} strokeWidth={7} {...drawProps(revenue)} />
          <text x={LABEL_X} y={B - REV_SLOPE * dx + 12} fontSize={36} fontWeight={800} fill={COLORS.green} opacity={revenue}>
            Revenue
          </text>
          <g opacity={point}>
            <line x1={BE_X} y1={BE_Y} x2={BE_X} y2={B} stroke={COLORS.green} strokeWidth={3} strokeDasharray="8 8" />
            <circle cx={BE_X} cy={BE_Y} r={20 * point} fill={COLORS.green} />
            <text x={BE_X - 30} y={BE_Y - 34} textAnchor="end" fontSize={44} fontWeight={800} fill={COLORS.text}>
              Break-even
            </text>
          </g>
        </svg>
      </div>
      <Enter delay={STAGGER * 4}>
        <SourceTag>Concept diagram · not to scale</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
