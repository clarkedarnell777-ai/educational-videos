import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {CARD, CARD_BALANCES_T, SAVE} from './math';
import type {SceneProps} from './types';

const SAVE_AT = data.scenes[2].captions[1].from; // "Average savings pays 0.38%."
const CARD_AT = 24;
const TICKER_AT = SAVE_AT + 40;

const BASE = 760; // y of 0%
const PX = 28; // px per percentage point (25% → 700 px)
const W = 300;
const X_CARD = 120;
const X_SAVE = 560;

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const grow = (to: number, start: number) =>
    interpolate(frame, [start, start + 36], [0, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  const card = grow(CARD, CARD_AT);
  const save = grow(SAVE, SAVE_AT);
  const ticker = useSpring(TICKER_AT);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>What you pay vs. what you earn</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>The rate gap</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={960} height={880} viewBox="0 0 960 880" style={{fontFamily: FONT}}>
          <line x1={40} y1={BASE} x2={920} y2={BASE} stroke={COLORS.muted} strokeWidth={4} />
          <rect x={X_CARD} y={BASE - card * PX} width={W} height={card * PX} rx={16} fill={COLORS.accent} />
          <rect x={X_SAVE} y={BASE - Math.max(save * PX, frame >= SAVE_AT ? 6 : 0)} width={W} height={Math.max(save * PX, frame >= SAVE_AT ? 6 : 0)} rx={3} fill={COLORS.green} />
          <text x={X_CARD + W / 2} y={BASE - card * PX - 28} textAnchor="middle" fontSize={76} fontWeight={800} fill={COLORS.text} opacity={card > 0.5 ? 1 : 0} style={{fontVariantNumeric: 'tabular-nums'}}>
            {card.toFixed(2)}%
          </text>
          <text x={X_SAVE + W / 2} y={BASE - 40} textAnchor="middle" fontSize={76} fontWeight={800} fill={COLORS.green} opacity={frame >= SAVE_AT ? 1 : 0} style={{fontVariantNumeric: 'tabular-nums'}}>
            {save.toFixed(2)}%
          </text>
          <text x={X_CARD + W / 2} y={BASE + 58} textAnchor="middle" fontSize={42} fontWeight={600} fill={COLORS.text}>Card APR</text>
          <text x={X_CARD + W / 2} y={BASE + 100} textAnchor="middle" fontSize={30} fontWeight={400} fill={COLORS.muted}>accounts charged interest</text>
          <text x={X_SAVE + W / 2} y={BASE + 58} textAnchor="middle" fontSize={42} fontWeight={600} fill={COLORS.text} opacity={frame >= SAVE_AT ? 1 : 0}>Savings APY</text>
          <text x={X_SAVE + W / 2} y={BASE + 100} textAnchor="middle" fontSize={30} fontWeight={400} fill={COLORS.muted} opacity={frame >= SAVE_AT ? 1 : 0}>national average</text>
        </svg>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 18,
          flexWrap: 'wrap',
          padding: '20px 28px',
          borderRadius: 20,
          background: COLORS.card,
          border: `2px solid ${COLORS.border}`,
          marginBottom: 20,
          opacity: ticker,
          transform: `translateX(${interpolate(ticker, [0, 1], [60, 0])}px)`,
        }}
      >
        <span style={{fontSize: 56, fontWeight: 800, color: COLORS.accent, fontVariantNumeric: 'tabular-nums'}}>
          ${CARD_BALANCES_T.toFixed(2)}T
        </span>
        <span style={{fontSize: 32, fontWeight: 600}}>owed on US credit cards · NY Fed, Q3 2026</span>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Fed G.19, Q3 2026 (preliminary; released Nov 6, 2026) · FDIC national rate, Oct 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
