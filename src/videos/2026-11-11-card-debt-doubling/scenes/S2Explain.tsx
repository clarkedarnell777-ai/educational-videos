import React from 'react';
import {interpolate} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const ON_INTEREST = data.scenes[1].captions[1].from; // "interest charged on last month's interest."

// Concept diagram (not to scale): each month's balance = last month's balance + interest on all of it.
const BASE_Y = 760;
const COL_W = 220;
const COLS = [
  {x: 60, label: 'Month 1', blocks: [{h: 300, kind: 'balance'}]},
  {x: 370, label: 'Month 2', blocks: [{h: 300, kind: 'balance'}, {h: 90, kind: 'interest'}]},
  {x: 680, label: 'Month 3', blocks: [{h: 300, kind: 'balance'}, {h: 90, kind: 'interest'}, {h: 90, kind: 'interest'}, {h: 36, kind: 'onInterest'}]},
] as const;

const fillFor = (kind: string) =>
  kind === 'balance' ? COLORS.card : kind === 'interest' ? COLORS.accent : COLORS.green;

const Column: React.FC<{i: number}> = ({i}) => {
  const col = COLS[i];
  const s = useSpring(STAGGER * 2 + i * STAGGER * 1.5);
  let y = BASE_Y;
  return (
    <g opacity={s} transform={`translate(0 ${interpolate(s, [0, 1], [40, 0])})`}>
      {col.blocks.map((b, j) => {
        y -= b.h + 6;
        return (
          <rect
            key={j}
            x={col.x}
            y={y}
            width={COL_W}
            height={b.h}
            rx={14}
            fill={fillFor(b.kind)}
            stroke={b.kind === 'balance' ? COLORS.border : 'none'}
            strokeWidth={3}
          />
        );
      })}
      <text x={col.x + COL_W / 2} y={BASE_Y + 56} textAnchor="middle" fontSize={40} fontWeight={600} fill={COLORS.text}>
        {col.label}
      </text>
    </g>
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const arrow = useDraw(ON_INTEREST, 22);
  const tag = useSpring(ON_INTEREST + 16);
  // top of Month 2's interest chip → Month 3's small "interest on interest" chip
  const fromY = BASE_Y - 306 - 96 + 45;
  const toY = BASE_Y - 306 - 96 - 96 - 42 + 18;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The engine</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Compound interest</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative'}}>
        <svg width={960} height={840} viewBox="0 0 960 840" style={{fontFamily: FONT}}>
          {COLS.map((_, i) => (
            <Column key={i} i={i} />
          ))}
          <path
            d={`M ${370 + COL_W} ${fromY} C ${600} ${fromY}, ${600} ${toY}, ${680 - 8} ${toY}`}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={8}
            strokeLinecap="round"
            {...drawProps(arrow)}
          />
          <g opacity={tag}>
            <text x={680 + COL_W / 2} y={toY - 92} textAnchor="middle" fontSize={34} fontWeight={800} fill={COLORS.green}>
              interest on
            </text>
            <text x={680 + COL_W / 2} y={toY - 54} textAnchor="middle" fontSize={34} fontWeight={800} fill={COLORS.green}>
              interest
            </text>
          </g>
        </svg>
        <div style={{display: 'flex', gap: 36, marginTop: 8}}>
          {[
            {c: COLORS.card, t: 'Balance', b: COLORS.border},
            {c: COLORS.accent, t: 'Interest', b: COLORS.accent},
            {c: COLORS.green, t: 'Interest on interest', b: COLORS.green},
          ].map((l, i) => (
            <Enter key={l.t} delay={STAGGER * 5 + i * STAGGER}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 600}}>
                <div style={{width: 30, height: 30, borderRadius: 8, background: l.c, border: `3px solid ${l.b}`}} />
                {l.t}
              </div>
            </Enter>
          ))}
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Concept diagram · not to scale</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
