import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {BALANCE, CARD, CARD_INTEREST_12M, grow, SAVE, SAVE_INTEREST_12M} from './math';
import type {SceneProps} from './types';

const [, CARD_AT, SAVE_AT] = data.scenes[3].captions.map((c) => c.from);
const CARD_DRAW_AT = 20;

// Plot area
const X0 = 150;
const X1 = 880;
const Y_TOP = 90;
const Y_BOT = 650;
const V_MIN = 4800;
const V_MAX = 6400;
const MONTHS = 12;

const x = (m: number) => X0 + (m / MONTHS) * (X1 - X0);
const y = (v: number) => Y_BOT - ((v - V_MIN) / (V_MAX - V_MIN)) * (Y_BOT - Y_TOP);
const path = (pct: number) =>
  new Array(MONTHS + 1)
    .fill(0)
    .map((_, m) => `${m === 0 ? 'M' : 'L'} ${x(m).toFixed(1)} ${y(grow(BALANCE, pct, m)).toFixed(1)}`)
    .join(' ');

const TICKS = [5000, 5500, 6000];

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const cardLine = useDraw(CARD_DRAW_AT, 50);
  const saveLine = useDraw(SAVE_AT - 6, 30);
  const cardTag = useSpring(CARD_AT);
  const saveTag = useSpring(SAVE_AT + 10);
  const cardEnd = grow(BALANCE, CARD, MONTHS);
  const saveEnd = grow(BALANCE, SAVE, MONTHS);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Illustrative</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          $5,000 left alone for 12 months
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={760} viewBox="0 0 960 760" style={{fontFamily: FONT}}>
          {TICKS.map((t) => (
            <g key={t}>
              <line x1={X0} y1={y(t)} x2={X1} y2={y(t)} stroke={COLORS.border} strokeWidth={2} />
              <text x={X0 - 16} y={y(t) + 10} textAnchor="end" fontSize={28} fill={COLORS.muted}>
                ${t.toLocaleString('en-US')}
              </text>
            </g>
          ))}
          <line x1={X0} y1={Y_BOT} x2={X1} y2={Y_BOT} stroke={COLORS.muted} strokeWidth={3} />
          {[0, 6, 12].map((m) => (
            <text key={m} x={x(m)} y={Y_BOT + 48} textAnchor="middle" fontSize={30} fill={COLORS.muted}>
              {m === 0 ? 'Start' : `Month ${m}`}
            </text>
          ))}
          <path d={path(CARD)} fill="none" stroke={COLORS.accent} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" {...drawProps(cardLine)} />
          <path d={path(SAVE)} fill="none" stroke={COLORS.green} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" {...drawProps(saveLine)} />
          <circle cx={x(MONTHS)} cy={y(cardEnd)} r={14} fill={COLORS.accent} opacity={cardLine >= 1 ? 1 : 0} />
          <circle cx={x(MONTHS)} cy={y(saveEnd)} r={14} fill={COLORS.green} opacity={saveLine >= 1 ? 1 : 0} />
          <text x={x(MONTHS)} y={y(saveEnd) + 60} textAnchor="end" fontSize={36} fontWeight={600} fill={COLORS.green} opacity={saveTag}>
            Savings at 0.38%
          </text>
          <text x={x(4)} y={y(cardEnd) - 10} textAnchor="middle" fontSize={36} fontWeight={600} fill={COLORS.accent} opacity={cardTag}>
            Card at {CARD}%
          </text>
        </svg>
      </div>
      <div style={{display: 'flex', gap: 24, marginBottom: 20}}>
        <div style={{flex: 1, padding: '22px 26px', borderRadius: 24, background: COLORS.card, border: `3px solid ${COLORS.accent}`, opacity: cardTag, transform: `scale(${interpolate(cardTag, [0, 1], [0.85, 1])})`}}>
          <div style={{fontSize: 30, fontWeight: 600, color: COLORS.muted}}>Card interest</div>
          <CountUp to={CARD_INTEREST_12M} start={CARD_AT} duration={30} prefix="+$" style={{fontSize: 72, fontWeight: 800, color: COLORS.text}} />
        </div>
        <div style={{flex: 1, padding: '22px 26px', borderRadius: 24, background: COLORS.card, border: `3px solid ${COLORS.green}`, opacity: saveTag, transform: `scale(${interpolate(saveTag, [0, 1], [0.85, 1])})`}}>
          <div style={{fontSize: 30, fontWeight: 600, color: COLORS.muted}}>Savings interest</div>
          <CountUp to={SAVE_INTEREST_12M} start={SAVE_AT + 10} duration={24} prefix="+$" style={{fontSize: 72, fontWeight: 800, color: COLORS.green}} />
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Monthly compounding, no payments or new charges, rates held constant</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
