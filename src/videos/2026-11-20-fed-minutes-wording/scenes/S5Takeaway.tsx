import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const PRICE_AT = data.scenes[4].captions[1].from;
const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

const Key: React.FC<{label: string; i: number}> = ({label, i}) => {
  const s = useSpring(10 + i * 3);
  const col = i % 3;
  const row = Math.floor(i / 3);
  return (
    <g opacity={s} transform={`translate(${30 + col * 90} ${150 + row * 80})`}>
      <rect width={74} height={64} rx={12} fill={COLORS.border} />
      <text x={37} y={45} textAnchor="middle" fontSize={34} fontWeight={800} fill={COLORS.text}>
        {label}
      </text>
    </g>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const calc = useSpring(4);
  const up = useSpring(PRICE_AT + 6);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your takeaway</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Price your payment at a <span style={{color: COLORS.green}}>higher rate</span> first
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={330} height={420} viewBox="0 0 330 420" style={{fontFamily: FONT, opacity: calc, transform: `scale(${interpolate(calc, [0, 1], [0.9, 1])})`}}>
          <rect x={10} y={10} width={310} height={400} rx={30} fill={COLORS.card} stroke={COLORS.accent} strokeWidth={6} />
          <rect x={30} y={30} width={270} height={100} rx={14} fill={COLORS.bg} />
          <text x={280} y={98} textAnchor="end" fontSize={56} fontWeight={800} fill={COLORS.green} opacity={up}>
            +rate?
          </text>
          {KEYS.map((k, i) => (
            <Key key={k} label={k} i={i} />
          ))}
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Educational only, not financial advice.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
