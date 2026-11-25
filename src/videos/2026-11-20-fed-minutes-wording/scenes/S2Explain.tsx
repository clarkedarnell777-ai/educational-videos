import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const C = data.scenes[1].captions;
const CAL_AT = C[1].from;
const WORD_AT = C[2].from;

const Calendar: React.FC<{x: number; month: string; day: string; s: number; color: string}> = ({x, month, day, s, color}) => (
  <g transform={`translate(${x} 40)`} opacity={s}>
    <rect x={0} y={0} width={240} height={240} rx={24} fill={COLORS.card} stroke={color} strokeWidth={5} />
    <rect x={0} y={0} width={240} height={64} rx={24} fill={color} />
    <rect x={0} y={40} width={240} height={24} fill={color} />
    <text x={120} y={46} textAnchor="middle" fontSize={34} fontWeight={800} fill={COLORS.text}>{month}</text>
    <text x={120} y={190} textAnchor="middle" fontSize={110} fontWeight={800} fill={COLORS.text}>{day}</text>
  </g>
);

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const cal1 = useSpring(C[0].from);
  const cal2 = useSpring(CAL_AT + 6);
  const bracket = useDraw(CAL_AT + 10, 24);
  const doc = useSpring(WORD_AT - 6);
  const hl = interpolate(frame, [WORD_AT + 6, WORD_AT + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Read the minutes</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>The meeting's notes, 3 weeks later</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30}}>
        <svg width={960} height={380} viewBox="0 0 960 380" style={{fontFamily: FONT}}>
          <Calendar x={60} month="OCT" day="28" s={cal1} color={COLORS.accent} />
          <Calendar x={660} month="NOV" day="18" s={cal2} color={COLORS.green} />
          <text x={480} y={170} textAnchor="middle" fontSize={40} fontWeight={800} fill={COLORS.text} opacity={bracket}>3 weeks</text>
          <path d="M 340 200 L 610 200" stroke={COLORS.muted} strokeWidth={5} strokeLinecap="round" {...drawProps(bracket)} />
        </svg>
        <div style={{width: 840, padding: '34px 40px', borderRadius: 24, background: COLORS.card, border: `3px solid ${COLORS.border}`, opacity: doc, transform: `translateY(${interpolate(doc, [0, 1], [40, 0])}px)`}}>
          <div style={{fontSize: 36, fontWeight: 800, letterSpacing: 6, color: COLORS.muted}}>MINUTES</div>
          <div style={{fontSize: 40, fontWeight: 600, lineHeight: 1.5, marginTop: 12}}>
            “
            <span style={{background: `linear-gradient(90deg, rgba(34,197,94,0.45) ${hl * 100}%, transparent ${hl * 100}%)`, padding: '0 6px', borderRadius: 6}}>
              almost all
            </span>{' '}
            participants judged…”
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
