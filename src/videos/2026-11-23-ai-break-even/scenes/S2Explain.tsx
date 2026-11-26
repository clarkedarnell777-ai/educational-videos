import React from 'react';
import {interpolate} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const C = data.scenes[1].captions;
const COST_AT = C[1].from; // "AI is a cost that must pay for itself."

const ROWS = ['Rent', 'Payroll', 'Software'];

const Row: React.FC<{label: string; i: number}> = ({label, i}) => {
  const s = useSpring(C[0].from + i * STAGGER);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '26px 34px',
        borderBottom: `2px solid ${COLORS.border}`,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
      }}
    >
      <div style={{fontSize: 44, fontWeight: 600}}>{label}</div>
      <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>monthly</div>
    </div>
  );
};

const Chip: React.FC<{draw: number}> = ({draw}) => (
  <svg width={84} height={84} viewBox="0 0 84 84" style={{fontFamily: FONT}}>
    {[22, 42, 62].map((p) => (
      <React.Fragment key={p}>
        <line x1={p} y1={4} x2={p} y2={16} stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round" />
        <line x1={p} y1={68} x2={p} y2={80} stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round" />
        <line x1={4} y1={p} x2={16} y2={p} stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round" />
        <line x1={68} y1={p} x2={80} y2={p} stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round" />
      </React.Fragment>
    ))}
    <rect x={16} y={16} width={52} height={52} rx={10} fill="none" stroke={COLORS.accent} strokeWidth={6} {...drawProps(draw)} />
    <text x={42} y={52} textAnchor="middle" fontSize={28} fontWeight={800} fill={COLORS.text}>
      AI
    </text>
  </svg>
);

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const ai = useSpring(COST_AT);
  const chip = useDraw(COST_AT + 4, 24);
  const tag = useSpring(COST_AT + 30);
  const earn = useSpring(COST_AT + 50);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>For small businesses</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          AI is a monthly cost. It has to <span style={{color: COLORS.green}}>earn its keep.</span>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
        <div style={{borderRadius: 28, background: COLORS.card, border: `3px solid ${COLORS.border}`, overflow: 'hidden'}}>
          <div style={{padding: '22px 34px', fontSize: 30, fontWeight: 800, letterSpacing: 4, color: COLORS.muted, background: COLORS.border}}>
            MONTHLY EXPENSES
          </div>
          {ROWS.map((r, i) => (
            <Row key={r} label={r} i={i} />
          ))}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '20px 34px',
              background: `rgba(99,102,241,${0.18 * ai})`,
              opacity: ai,
              transform: `translateX(${interpolate(ai, [0, 1], [500, 0])}px)`,
            }}
          >
            <Chip draw={chip} />
            <div style={{fontSize: 44, fontWeight: 800, flex: 1}}>AI tool</div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: COLORS.accent,
                border: `3px solid ${COLORS.accent}`,
                borderRadius: 14,
                padding: '8px 16px',
                opacity: tag,
              }}
            >
              OPERATING COST
            </div>
          </div>
        </div>
        <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted, opacity: earn, textAlign: 'center'}}>
          Time saved must be worth <span style={{color: COLORS.text, fontWeight: 800}}>more than the bill</span>
        </div>
      </div>
    </SceneFrame>
  );
};
