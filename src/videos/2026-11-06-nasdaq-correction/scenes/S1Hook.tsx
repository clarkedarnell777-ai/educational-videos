import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import {DAY_PCT, layout} from './chart';
import type {SceneProps} from './types';

const W = 900;
const H = 520;
const {pts, d} = layout(W, H, 24000, 27800);

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const draw = useDraw(STAGGER * 2, 50);
  const drop = useSpring(72);
  const pct = interpolate(frame, [72, 108], [0, DAY_PCT], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const last = pts[pts.length - 1];
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Nasdaq Composite · Nov 5, 2026</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Into a correction</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40}}>
        <div
          style={{
            fontSize: 190,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            opacity: drop,
            translate: `0px ${interpolate(drop, [0, 1], [40, 0])}px`,
          }}
        >
          {pct.toFixed(2).replace('-', '−')}%
          <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted, marginTop: 16}}>in one day</div>
        </div>
        <svg width={W} height={H + 40} viewBox={`-20 -20 ${W + 40} ${H + 40}`} style={{fontFamily: FONT}}>
          <path d={d} fill="none" stroke={COLORS.accent} strokeWidth={8} strokeLinejoin="round" {...drawProps(draw)} />
          <circle cx={last.x} cy={last.y} r={16} fill={COLORS.text} opacity={drop} />
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Daily closes, Oct 6–Nov 5, 2026 · Nasdaq via FRED</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
