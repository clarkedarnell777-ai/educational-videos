import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {FED_HIGH, FED_LOW} from './math';
import type {SceneProps} from './types';

const BRACE_AT = data.scenes[0].captions[1].from; // "So why are borrowers bracing?"

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const card = useSpring(6);
  const stamp = useSpring(22);
  const stampScale = interpolate(stamp, [0, 1], [2.2, 1]);
  const arrow = useDraw(BRACE_AT, 28);
  const shake = frame > BRACE_AT + 20 ? Math.sin(frame / 2) * 2 : 0;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Federal Reserve · October</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          The Fed held. Borrowers are <span style={{color: COLORS.green}}>bracing.</span>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={940} height={680} viewBox="0 0 940 680" style={{fontFamily: FONT}}>
          <path d="M 80 600 C 300 560, 520 420, 860 120" fill="none" stroke={COLORS.accent} strokeWidth={14} strokeLinecap="round" opacity={0.9} {...drawProps(arrow)} />
          <path d="M 800 110 L 870 110 L 860 180" fill="none" stroke={COLORS.accent} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.95 ? 1 : 0} />
          <g opacity={card} transform={`translate(${470 + shake} 360) scale(${interpolate(card, [0, 1], [0.9, 1])})`}>
            <rect x={-330} y={-170} width={660} height={340} rx={36} fill={COLORS.card} stroke={COLORS.border} strokeWidth={4} />
            <text x={0} y={-80} textAnchor="middle" fontSize={36} fontWeight={600} fill={COLORS.muted}>
              Fed funds target range
            </text>
            <text x={0} y={30} textAnchor="middle" fontSize={96} fontWeight={800} fill={COLORS.text}>
              {FED_LOW.toFixed(2)}–{FED_HIGH.toFixed(2)}%
            </text>
          </g>
          <g opacity={stamp} transform={`translate(470 500) rotate(-8) scale(${stampScale})`}>
            <rect x={-150} y={-56} width={300} height={112} rx={14} fill="none" stroke={COLORS.green} strokeWidth={10} />
            <text x={0} y={30} textAnchor="middle" fontSize={84} fontWeight={800} fill={COLORS.green} letterSpacing={8}>
              HOLD
            </text>
          </g>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>FOMC decision Oct 28, 2026 · vote 10–2</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
