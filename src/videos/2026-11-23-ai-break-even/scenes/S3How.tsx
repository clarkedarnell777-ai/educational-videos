import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {BREAK_EVEN_HOURS, HOURS_SAVED, NET_PER_MONTH, TIME_PER_HOUR, TOOL_PER_MONTH, VALUE_SAVED} from './math';
import type {SceneProps} from './types';

const C = data.scenes[2].captions;
const TOOL_AT = C[0].from; // "$30 monthly tool"
const RATE_AT = C[1].from; // "$25 an hour"
const LEVEL_AT = C[2].from; // "Save 1.2 hours ... breaks even"
const TIP_AT = LEVEL_AT + 62;

const PIVOT = {x: 480, y: 90};
const ARM = 330;
const STRING = 150;

const Clock: React.FC<{x: number; y: number; fill: number}> = ({x, y, fill}) => (
  <g transform={`translate(${x} ${y})`} opacity={fill > 0 ? 1 : 0}>
    <rect x={-30} y={-30} width={60} height={60} rx={10} fill={COLORS.card} stroke={COLORS.green} strokeWidth={4} />
    <rect x={-26} y={26 - 52 * fill} width={52} height={52 * fill} rx={6} fill="rgba(34,197,94,0.45)" />
    <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.text} strokeWidth={3} />
    <path d="M 0 -9 L 0 0 L 7 5" fill="none" stroke={COLORS.text} strokeWidth={3} strokeLinecap="round" />
  </g>
);

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const scale = useSpring(4);
  const tool = useSpring(TOOL_AT + 6);
  const rate = useSpring(RATE_AT);
  const level = useSpring(LEVEL_AT);
  const tip = useSpring(TIP_AT);
  const eq = useSpring(LEVEL_AT + 24);
  const gain = useSpring(TIP_AT + 16);

  const hours = BREAK_EVEN_HOURS * level + (HOURS_SAVED - BREAK_EVEN_HOURS) * tip;
  const angleDeg = -9 * tool * (1 - level) + 9 * tip;
  const a = (angleDeg * Math.PI) / 180;
  const L = {x: PIVOT.x - ARM * Math.cos(a), y: PIVOT.y - ARM * Math.sin(a)};
  const R = {x: PIVOT.x + ARM * Math.cos(a), y: PIVOT.y + ARM * Math.sin(a)};
  const levelGlow = level * (1 - tip);

  // 8 one-hour blocks in two rows of four; each fills by its share of `hours`.
  const blocks = new Array(HOURS_SAVED).fill(0).map((_, i) => Math.max(0, Math.min(1, hours - i)));

  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Kicker>Break-even math</Kicker>
          <div style={{fontSize: 30, fontWeight: 800, color: COLORS.bg, background: COLORS.accent, borderRadius: 10, padding: '4px 14px', letterSpacing: 2}}>
            ILLUSTRATIVE
          </div>
        </div>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>When does it pay for itself?</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 26}}>
        <svg width={960} height={560} viewBox="0 0 960 560" style={{fontFamily: FONT, opacity: scale}}>
          {/* stand */}
          <path d={`M ${PIVOT.x} ${PIVOT.y} L ${PIVOT.x} 520 M ${PIVOT.x - 110} 520 L ${PIVOT.x + 110} 520`} stroke={COLORS.border} strokeWidth={12} strokeLinecap="round" />
          <circle cx={PIVOT.x} cy={PIVOT.y} r={16} fill={levelGlow > 0.5 ? COLORS.green : COLORS.muted} />
          {/* beam */}
          <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke={levelGlow > 0.5 ? COLORS.green : COLORS.text} strokeWidth={10} strokeLinecap="round" />
          {/* left pan: the tool */}
          <g transform={`translate(${L.x} ${L.y})`}>
            <line x1={0} y1={0} x2={0} y2={STRING} stroke={COLORS.muted} strokeWidth={4} />
            <path d={`M -120 ${STRING} L 120 ${STRING} L 92 ${STRING + 30} L -92 ${STRING + 30} Z`} fill={COLORS.border} />
            <g opacity={tool} transform={`translate(0 ${STRING - 10}) scale(${interpolate(tool, [0, 1], [0.6, 1])})`}>
              <rect x={-100} y={-100} width={200} height={100} rx={16} fill={COLORS.accent} />
              <text x={0} y={-56} textAnchor="middle" fontSize={44} fontWeight={800} fill={COLORS.text}>
                ${TOOL_PER_MONTH}/mo
              </text>
              <text x={0} y={-18} textAnchor="middle" fontSize={30} fontWeight={600} fill={COLORS.text}>
                AI tool
              </text>
            </g>
          </g>
          {/* right pan: hours saved */}
          <g transform={`translate(${R.x} ${R.y})`}>
            <line x1={0} y1={0} x2={0} y2={STRING} stroke={COLORS.muted} strokeWidth={4} />
            <path d={`M -150 ${STRING} L 150 ${STRING} L 120 ${STRING + 30} L -120 ${STRING + 30} Z`} fill={COLORS.border} />
            {blocks.map((fill, i) => (
              <Clock key={i} x={-105 + (i % 4) * 70} y={STRING - 40 - Math.floor(i / 4) * 68} fill={fill} />
            ))}
            <text x={0} y={STRING + 80} textAnchor="middle" fontSize={36} fontWeight={800} fill={COLORS.text} opacity={rate} style={{fontVariantNumeric: 'tabular-nums'}}>
              {hours.toFixed(1)} hrs × ${TIME_PER_HOUR}/hr
            </text>
          </g>
        </svg>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            opacity: eq,
            transform: `translateY(${interpolate(eq, [0, 1], [24, 0])}px)`,
          }}
        >
          ${TOOL_PER_MONTH} ÷ ${TIME_PER_HOUR}/hr = <span style={{color: COLORS.green}}>{BREAK_EVEN_HOURS.toFixed(1)} hrs/mo</span>
        </div>
        <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted, opacity: gain, fontVariantNumeric: 'tabular-nums'}}>
          Save {HOURS_SAVED} hrs = ${VALUE_SAVED} value →{' '}
          <CountUp to={NET_PER_MONTH} start={TIP_AT + 20} duration={24} prefix="+$" suffix="/mo" style={{color: COLORS.green, fontWeight: 800, fontSize: 52}} />
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Illustrative example, not data · your costs and time value will differ</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
