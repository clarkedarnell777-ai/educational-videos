import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {COMPOSITE} from './math';
import type {SceneProps} from './types';

const LAST_AT = data.scenes[0].captions[1].from; // "That number won't last."

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const card = useSpring(4);
  const border = useDraw(6, 26);
  const clock = useSpring(LAST_AT - 4);
  const hand = Math.max(0, frame - LAST_AT) * 9;
  const flicker = frame > LAST_AT + 10 ? 0.75 + 0.25 * Math.cos((frame - LAST_AT) / 3) : 1;
  const forNow = useSpring(LAST_AT + 8);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>U.S. savings bonds</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          I bonds pay {COMPOSITE.toFixed(2)}%… <span style={{color: COLORS.green, opacity: forNow}}>for now</span>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', opacity: card, transform: `scale(${interpolate(card, [0, 1], [0.9, 1])})`}}>
          <svg width={900} height={520} viewBox="0 0 900 520" style={{fontFamily: FONT}}>
            <rect x={10} y={10} width={880} height={500} rx={36} fill={COLORS.card} stroke={COLORS.accent} strokeWidth={6} {...drawProps(border)} />
            <rect x={40} y={40} width={820} height={440} rx={24} fill="none" stroke={COLORS.border} strokeWidth={3} strokeDasharray="10 10" />
            <text x={80} y={110} fontSize={36} fontWeight={600} fill={COLORS.muted}>Series I savings bond</text>
            {/* clock */}
            <g transform="translate(780 100)" opacity={clock}>
              <circle r={44} fill="none" stroke={COLORS.accent} strokeWidth={6} />
              <line x1={0} y1={0} x2={0} y2={-30} stroke={COLORS.text} strokeWidth={6} strokeLinecap="round" transform={`rotate(${hand})`} />
              <circle r={6} fill={COLORS.text} />
            </g>
          </svg>
          <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontSize: 190, fontWeight: 800, opacity: flicker}}>
            <CountUp to={COMPOSITE} start={10} duration={40} decimals={2} suffix="%" />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', fontSize: 36, fontWeight: 600, color: COLORS.muted}}>
            annual rate, next 6 months
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
