import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

const STAMP = 104; // lands on "can't save the deal"

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const axis = useDraw(STAGGER, 18);
  const line = useDraw(STAGGER * 2, 56);
  const label = useSpring(58);
  const stamp = useSpring(STAMP);
  const drop = interpolate(frame, [STAMP + 6, STAMP + 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>SBA 7(a) · Buying a business</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Your forecast likely can't save the deal
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={720} viewBox="0 0 960 720" style={{fontFamily: FONT}}>
          <path d="M 60 60 L 60 660 L 900 660" fill="none" stroke={COLORS.muted} strokeWidth={4} {...drawProps(axis)} />
          <g
            opacity={1 - 0.75 * drop}
            transform={`translate(0 ${interpolate(drop, [0, 1], [0, 90])})`}
          >
            <path
              d="M 90 610 C 300 590, 480 500, 620 340 S 800 130, 880 90"
              fill="none"
              stroke={COLORS.accent}
              strokeWidth={14}
              strokeLinecap="round"
              {...drawProps(line)}
            />
            <text x={120} y={250} fontSize={48} fontWeight={800} fill={COLORS.accent} opacity={label}>
              Your forecast
            </text>
          </g>
          <g
            opacity={stamp}
            transform={`translate(480 360) scale(${interpolate(stamp, [0, 1], [1.5, 1])})`}
          >
            <path d="M -170 -170 L 170 170 M 170 -170 L -170 170" stroke={COLORS.muted} strokeWidth={46} strokeLinecap="round" />
          </g>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Rules effective Oct 1, 2026 · SBA SOP 50 10 8.1</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
