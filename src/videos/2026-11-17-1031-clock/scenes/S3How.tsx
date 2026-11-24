import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {IDENTIFY_DAYS, RECEIVE_DAYS, SOURCE} from './math';
import type {SceneProps} from './types';

const C = data.scenes[2].captions;
const IDENT_AT = C[0].from;
const CLOSE_AT = C[1].from;
const DUE_AT = C[2].from;
const X0 = 60;
const X1 = 900;
const xFor = (day: number) => X0 + ((X1 - X0) * day) / RECEIVE_DAYS;

const Marker: React.FC<{x: number; color: string; at: number; day: number; label: string; up?: boolean}> = ({x, color, at, day, label, up}) => {
  const s = useSpring(at);
  const y = up ? 150 : 330;
  return (
    <g opacity={s} transform={`translate(0 ${interpolate(s, [0, 1], [up ? -30 : 30, 0])})`}>
      <circle cx={x} cy={260} r={22} fill={color} />
      <text x={x} y={y} textAnchor="middle" fontSize={44} fontWeight={800} fill={color}>Day {day}</text>
      <text x={x} y={y + 46} textAnchor="middle" fontSize={34} fontWeight={600} fill={COLORS.text}>{label}</text>
    </g>
  );
};

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const line = useDraw(8, 40);
  const due = useSpring(DUE_AT + 4);
  const earlier = useSpring(DUE_AT + 4 + STAGGER * 2);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The two deadlines</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          <CountUp to={IDENTIFY_DAYS} start={IDENT_AT} duration={24} /> days, then{' '}
          <span style={{color: COLORS.green}}><CountUp to={RECEIVE_DAYS} start={CLOSE_AT} duration={30} /></span>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={620} viewBox="0 0 960 620" style={{fontFamily: FONT}}>
          <path d={`M ${X0} 260 L ${X1} 260`} stroke={COLORS.border} strokeWidth={10} strokeLinecap="round" fill="none" {...drawProps(line)} />
          <Marker x={X0} color={COLORS.muted} at={6} day={0} label="Sale closes" up />
          <Marker x={xFor(IDENTIFY_DAYS)} color={COLORS.accent} at={IDENT_AT + 6} day={IDENTIFY_DAYS} label="Identify" />
          <Marker x={xFor(RECEIVE_DAYS) - 40} color={COLORS.green} at={CLOSE_AT + 4} day={RECEIVE_DAYS} label="Close" up />
          <g opacity={due} transform={`translate(0 ${interpolate(due, [0, 1], [-60, 0])})`}>
            <rect x={300} y={430} width={600} height={90} rx={20} fill={COLORS.card} stroke={COLORS.accent} strokeWidth={4} />
            <text x={600} y={488} textAnchor="middle" fontSize={40} fontWeight={800} fill={COLORS.text}>…or tax return due date</text>
          </g>
          <text x={600} y={575} textAnchor="middle" fontSize={36} fontWeight={600} fill={COLORS.green} opacity={earlier}>whichever is earlier</text>
        </svg>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>{SOURCE}</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
