import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {DAYS_LOST, DUE_DAY, IDENTIFY_DAYS, LABELS, RECEIVE_DAYS} from './math';
import type {SceneProps} from './types';

const C = data.scenes[3].captions;
const D180_AT = C[1].from;
const DUE_AT = C[2].from;
const RED = '#ef4444';
const Y0 = 60;
const Y1 = 620;
const yFor = (day: number) => Y0 + ((Y1 - Y0) * day) / RECEIVE_DAYS;

const Stop: React.FC<{day: number; date: string; label: string; color: string; at: number; faded?: number}> = ({day, date, label, color, at, faded = 0}) => {
  const s = useSpring(at);
  const y = yFor(day);
  return (
    <g opacity={s * (1 - faded * 0.6)} transform={`translate(${interpolate(s, [0, 1], [-30, 0])} 0)`}>
      <circle cx={120} cy={y} r={20} fill={color} />
      <text x={170} y={y - 4} fontSize={44} fontWeight={800} fill={color}>{date}</text>
      <text x={170} y={y + 38} fontSize={30} fontWeight={600} fill={COLORS.muted}>Day {day} · {label}</text>
    </g>
  );
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const spine = useDraw(6, 40);
  const flag = useSpring(DUE_AT + 4);
  const bracket = useDraw(DUE_AT + 16, 20);
  const faded = useSpring(DUE_AT + 20);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
          <Kicker>One sale, real dates</Kicker>
          <div style={{fontSize: 28, fontWeight: 800, color: COLORS.bg, background: COLORS.green, borderRadius: 10, padding: '4px 14px'}}>ILLUSTRATIVE</div>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={700} viewBox="0 0 960 700" style={{fontFamily: FONT}}>
          <path d={`M 120 ${Y0} L 120 ${Y1}`} stroke={COLORS.border} strokeWidth={8} strokeLinecap="round" fill="none" {...drawProps(spine)} />
          <Stop day={0} date={LABELS.sale} label="sale" color={COLORS.text} at={8} />
          <Stop day={IDENTIFY_DAYS} date={LABELS.day45} label="identify by" color={COLORS.accent} at={8 + STAGGER} />
          <Stop day={DUE_DAY} date={LABELS.due} label="return due" color={RED} at={DUE_AT} />
          <Stop day={RECEIVE_DAYS} date={LABELS.day180} label="180 days" color={COLORS.green} at={D180_AT} faded={faded} />
          <path d={`M 80 ${yFor(DUE_DAY)} L 50 ${yFor(DUE_DAY)} L 50 ${yFor(RECEIVE_DAYS)} L 80 ${yFor(RECEIVE_DAYS)}`} stroke={RED} strokeWidth={6} fill="none" {...drawProps(bracket)} />
          <g opacity={flag}>
            <rect x={600} y={yFor(DUE_DAY) - 150} width={330} height={120} rx={20} fill={COLORS.card} stroke={RED} strokeWidth={4} />
            <text x={765} y={yFor(DUE_DAY) - 70} textAnchor="middle" fontSize={64} fontWeight={800} fill={RED}>
              <CountUp to={DAYS_LOST} start={DUE_AT + 16} duration={30} suffix=" days" />
            </text>
          </g>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Dates computed for a Nov 17, 2026 sale · Apr 15, 2027 due date (IRS draft Form 4868)</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
