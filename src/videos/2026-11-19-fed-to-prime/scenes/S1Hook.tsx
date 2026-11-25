import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {VOTES_HIKE, VOTES_HOLD} from './math';
import type {SceneProps} from './types';

const FLOAT_AT = data.scenes[0].captions[1].from; // "If your loan floats…"
const N = VOTES_HOLD + VOTES_HIKE;

const Dot: React.FC<{i: number}> = ({i}) => {
  const on = useSpring(16 + i * 3);
  const isHike = i >= VOTES_HOLD;
  const flip = useSpring(16 + N * 3 + 10);
  const color = isHike ? (flip > 0.5 ? COLORS.green : COLORS.accent) : COLORS.accent;
  const lift = isHike ? interpolate(flip, [0, 1], [0, -26]) : 0;
  const col = i % 4;
  const row = Math.floor(i / 4);
  const cx = 150 + col * 200;
  const cy = 80 + row * 130 + lift;
  return (
    <g opacity={on} transform={`translate(${cx} ${cy}) scale(${interpolate(on, [0, 1], [0.4, 1])})`}>
      <circle r={52} fill={color} opacity={isHike ? 1 : 0.85} />
      {isHike ? (
        <path d="M 0 -26 L 22 4 L 8 4 L 8 26 L -8 26 L -8 4 L -22 4 Z" fill={COLORS.bg} opacity={flip} />
      ) : (
        <rect x={-20} y={-6} width={40} height={12} rx={6} fill={COLORS.bg} opacity={0.6} />
      )}
    </g>
  );
};

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const legend = useSpring(16 + N * 3 + 16);
  const floatS = useSpring(FLOAT_AT);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>FOMC · Oct 28, 2026</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Two Fed officials <span style={{color: COLORS.green}}>wanted a hike</span>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={900} height={420} viewBox="0 0 900 420" style={{fontFamily: FONT}}>
          {new Array(N).fill(0).map((_, i) => (
            <Dot key={i} i={i} />
          ))}
        </svg>
        <div style={{display: 'flex', gap: 48, fontSize: 36, fontWeight: 600, opacity: legend}}>
          <span style={{color: COLORS.accent}}>● {VOTES_HOLD} hold</span>
          <span style={{color: COLORS.green}}>▲ {VOTES_HIKE} raise</span>
        </div>
        <div
          style={{
            marginTop: 36,
            padding: '16px 32px',
            borderRadius: 18,
            border: `3px solid ${COLORS.accent}`,
            fontSize: 44,
            fontWeight: 800,
            opacity: floatS,
            transform: `scale(${interpolate(floatS, [0, 1], [0.9, 1])})`,
          }}
        >
          Does your loan float?
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Rates held 10–2 · Federal Reserve statement, Oct 28, 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
