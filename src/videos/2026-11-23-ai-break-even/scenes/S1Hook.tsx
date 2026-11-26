import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import {AI_RATE} from './math';
import type {SceneProps} from './types';

const LIT = 2; // the one storefront in five that uses AI
const SHOP_W = 168;
const GAP = 20;

const Storefront: React.FC<{i: number}> = ({i}) => {
  const s = useSpring(20 + i * STAGGER);
  const lit = useSpring(80);
  const isLit = i === LIT;
  const x = i * (SHOP_W + GAP);
  const stroke = isLit ? interpolate(lit, [0, 1], [0, 1]) : 0;
  const color = isLit && stroke > 0.5 ? COLORS.accent : COLORS.muted;
  return (
    <g opacity={s} transform={`translate(${x} ${interpolate(s, [0, 1], [40, 0])})`}>
      {/* awning */}
      <path d={`M 0 60 L 14 10 L ${SHOP_W - 14} 10 L ${SHOP_W} 60 Z`} fill={isLit ? `rgba(99,102,241,${0.25 + 0.6 * stroke})` : COLORS.border} />
      {/* body */}
      <rect x={10} y={60} width={SHOP_W - 20} height={170} rx={8} fill={COLORS.card} stroke={color} strokeWidth={5} />
      {/* door */}
      <rect x={SHOP_W / 2 - 24} y={150} width={48} height={80} rx={6} fill={isLit ? `rgba(99,102,241,${0.6 * stroke})` : COLORS.border} />
      {/* window */}
      <rect x={24} y={84} width={SHOP_W - 48} height={44} rx={6} fill={isLit ? `rgba(34,197,94,${0.7 * stroke})` : COLORS.border} />
      {isLit ? (
        <text x={SHOP_W / 2} y={-26} textAnchor="middle" fontSize={44} fontWeight={800} fill={COLORS.accent} opacity={stroke}>
          AI
        </text>
      ) : null}
    </g>
  );
};

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const ring = useDraw(90, 30);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>U.S. businesses · AI use</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          About <span style={{color: COLORS.green}}>1 in 5</span> use AI
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40}}>
        <svg width={920} height={300} viewBox="0 -70 920 300" style={{fontFamily: FONT, overflow: 'visible'}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Storefront key={i} i={i} />
          ))}
        </svg>
        <div style={{position: 'relative', width: 520, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={520} height={260} viewBox="0 0 520 260" style={{position: 'absolute', inset: 0}}>
            <rect x={6} y={6} width={508} height={248} rx={124} fill="none" stroke={COLORS.green} strokeWidth={6} {...drawProps(ring)} />
          </svg>
          <CountUp to={AI_RATE} start={90} duration={36} decimals={1} suffix="%" style={{fontSize: 140, fontWeight: 800, color: COLORS.green}} />
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Census BTOS, national rate, period ending May 3, 2026 (spring 2026)</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
