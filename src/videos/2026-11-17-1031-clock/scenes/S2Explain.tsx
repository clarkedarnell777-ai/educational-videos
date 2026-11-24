import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const REINVEST_AT = data.scenes[1].captions[1].from; // "when you reinvest in real estate."

const House: React.FC<{x: number; y: number; color: string; progress: number}> = ({x, y, color, progress}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M 0 90 L 90 10 L 180 90 L 180 210 L 0 210 Z" fill="none" stroke={color} strokeWidth={8} strokeLinejoin="round" {...drawProps(progress)} />
    <rect x={70} y={140} width={40} height={70} fill="none" stroke={color} strokeWidth={6} opacity={progress} />
  </g>
);

const Building: React.FC<{x: number; y: number; color: string; progress: number}> = ({x, y, color, progress}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M 0 210 L 0 0 L 160 0 L 160 210 Z" fill="none" stroke={color} strokeWidth={8} strokeLinejoin="round" {...drawProps(progress)} />
    {[0, 1, 2].map((r) =>
      [0, 1].map((c) => (
        <rect key={`${r}-${c}`} x={30 + c * 64} y={30 + r * 56} width={36} height={32} rx={4} fill={color} opacity={progress * 0.8} />
      )),
    )}
  </g>
);

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const house = useDraw(10, 26);
  const arrow = useDraw(REINVEST_AT - 8, 22);
  const building = useDraw(REINVEST_AT + 8, 26);
  const bill = useSpring(30);
  const slide = interpolate(frame, [REINVEST_AT + 20, REINVEST_AT + 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const label = useSpring(REINVEST_AT + 40);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>What a 1031 exchange does</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Swap property, delay the tax</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={640} viewBox="0 0 960 640" style={{fontFamily: FONT}}>
          <House x={40} y={300} color={COLORS.accent} progress={house} />
          <text x={130} y={570} textAnchor="middle" fontSize={34} fontWeight={600} fill={COLORS.accent} opacity={house}>Old rental</text>
          <path d="M 260 410 L 640 410" stroke={COLORS.text} strokeWidth={8} strokeLinecap="round" fill="none" {...drawProps(arrow)} />
          <path d="M 610 380 L 645 410 L 610 440" stroke={COLORS.text} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={arrow} />
          <text x={450} y={385} textAnchor="middle" fontSize={32} fontWeight={600} fill={COLORS.muted} opacity={arrow}>reinvest</text>
          <Building x={720} y={300} color={COLORS.green} progress={building} />
          <text x={800} y={570} textAnchor="middle" fontSize={34} fontWeight={600} fill={COLORS.green} opacity={building}>New property</text>
          {/* tax bill slides aside */}
          <g transform={`translate(${interpolate(slide, [0, 1], [130, 560])} ${interpolate(slide, [0, 1], [120, 40])})`} opacity={bill}>
            <rect x={-90} y={0} width={180} height={150} rx={14} fill={COLORS.card} stroke={COLORS.muted} strokeWidth={4} />
            <text x={0} y={60} textAnchor="middle" fontSize={40} fontWeight={800} fill={COLORS.text}>TAX</text>
            <text x={0} y={110} textAnchor="middle" fontSize={30} fontWeight={600} fill={COLORS.muted}>on the gain</text>
          </g>
          <text x={900} y={240} textAnchor="end" fontSize={34} fontWeight={800} fill={COLORS.green} opacity={label}>deferred, not erased</text>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Real property held for business or investment · IRS Form 8824 instructions</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
