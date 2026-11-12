import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const LEAVE_AT = data.scenes[0].captions[1].from; // "and you stop counting as unemployed."

// Person walks along the job-search path into the box, then steps out of it.
const PathPerson: React.FC<{x: number; y: number; color: string; opacity: number}> = ({x, y, color, opacity}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <circle cx={0} cy={-78} r={24} fill={color} />
    <rect x={-22} y={-50} width={44} height={60} rx={18} fill={color} />
    <rect x={-18} y={8} width={14} height={40} rx={7} fill={color} />
    <rect x={4} y={8} width={14} height={40} rx={7} fill={color} />
  </g>
);

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const path = useDraw(6, 26);
  const box = useDraw(14, 22);
  const walkIn = interpolate(frame, [10, LEAVE_AT - 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const walkOut = interpolate(frame, [LEAVE_AT, LEAVE_AT + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const x = interpolate(walkIn, [0, 1], [90, 610]) + walkOut * 230;
  const y = 470 - walkOut * 260;
  const fade = interpolate(walkOut, [0.4, 1], [1, 0.25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const appear = useSpring(4);
  const counted = useSpring(LEAVE_AT + 12);
  const headline = useSpring(LEAVE_AT + 6);
  const color = walkOut > 0.3 ? COLORS.muted : COLORS.green;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Jobs report fine print</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Stopped looking?
        </div>
      </Enter>
      <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, color: COLORS.green, opacity: headline, transform: `translateY(${interpolate(headline, [0, 1], [30, 0])}px)`}}>
        You're not "unemployed."
      </div>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={640} viewBox="0 0 960 640" style={{fontFamily: FONT}}>
          {/* job-search path */}
          <path d="M 40 520 L 520 520" stroke={COLORS.accent} strokeWidth={10} strokeLinecap="round" fill="none" {...drawProps(path)} />
          <text x={60} y={590} fontSize={34} fontWeight={600} fill={COLORS.accent} opacity={path}>Job search</text>
          {/* "Unemployed" box */}
          <rect x={500} y={300} width={240} height={250} rx={24} fill="none" stroke={COLORS.green} strokeWidth={6} {...drawProps(box)} />
          <text x={620} y={280} textAnchor="middle" fontSize={36} fontWeight={800} fill={COLORS.green} opacity={box}>Unemployed</text>
          {/* exit arrow */}
          <path d="M 760 300 Q 830 200 860 130" stroke={COLORS.muted} strokeWidth={5} strokeDasharray="12 12" fill="none" opacity={walkOut} />
          <text x={940} y={90} textAnchor="end" fontSize={32} fontWeight={600} fill={COLORS.muted} opacity={counted}>
            Not counted
          </text>
          <PathPerson x={x} y={y} color={color} opacity={fade * appear} />
        </svg>
      </div>
    </SceneFrame>
  );
};
