import React from 'react';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

// Diagram geometry (SVG units = px; the SVG is 960 wide, same as the content column).
const NODE_W = 500;
const NODE_H = 130;
const NODE_X = 40;
const CX = NODE_X + NODE_W / 2; // 290
const NODES = [
  {y: 20, label: 'Depositors', highlight: false},
  {y: 340, label: 'Bank', highlight: true},
  {y: 660, label: 'Borrowers', highlight: false},
];

const Node: React.FC<{y: number; label: string; highlight: boolean; delay: number}> = ({
  y,
  label,
  highlight,
  delay,
}) => {
  const s = useSpring(delay);
  return (
    <g opacity={s} transform={`translate(0 ${(1 - s) * 30})`}>
      <rect
        x={NODE_X}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={28}
        fill={highlight ? COLORS.accent : COLORS.card}
        stroke={highlight ? COLORS.accent : COLORS.border}
        strokeWidth={3}
      />
      <text
        x={CX}
        y={y + NODE_H / 2 + 16}
        textAnchor="middle"
        fontSize={46}
        fontWeight={800}
        fill={COLORS.text}
      >
        {label}
      </text>
    </g>
  );
};

const Arrow: React.FC<{y1: number; y2: number; start: number; label: string; rate: string; rateColor: string}> = ({
  y1,
  y2,
  start,
  label,
  rate,
  rateColor,
}) => {
  const p = useDraw(start, 22);
  const t = useSpring(start + 14);
  return (
    <g>
      <line x1={CX} y1={y1} x2={CX} y2={y2 - 14} stroke={COLORS.text} strokeWidth={6} strokeLinecap="round" {...drawProps(p)} />
      <path
        d={`M ${CX - 20} ${y2 - 30} L ${CX} ${y2 - 4} L ${CX + 20} ${y2 - 30}`}
        fill="none"
        stroke={COLORS.text}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={p >= 1 ? 1 : 0}
      />
      <g opacity={t}>
        <text x={CX + 40} y={(y1 + y2) / 2 - 8} fontSize={32} fontWeight={600} fill={COLORS.muted}>
          {label}
        </text>
        <text x={CX + 40} y={(y1 + y2) / 2 + 40} fontSize={40} fontWeight={800} fill={rateColor}>
          {rate}
        </text>
      </g>
    </g>
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  // Bracket drawn after both arrows.
  const bracket = useDraw(STAGGER * 7, 26);
  const bracketLabel = useSpring(STAGGER * 9);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>How banks earn</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 92, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>The Spread</div>
      </Enter>
      <Enter delay={STAGGER * 2}>
        <div style={{fontSize: 44, fontWeight: 600, color: COLORS.muted, marginTop: 10}}>
          Borrow low. Lend high.
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
        <svg width={960} height={810} viewBox="0 0 960 810">
          {NODES.map((n, i) => (
            <Node key={n.label} {...n} delay={STAGGER * (2 + i)} />
          ))}
          <Arrow
            y1={NODES[0].y + NODE_H}
            y2={NODES[1].y}
            start={STAGGER * 5}
            label="Deposits in · bank pays"
            rate="0.38%"
            rateColor={COLORS.green}
          />
          <Arrow
            y1={NODES[1].y + NODE_H}
            y2={NODES[2].y}
            start={STAGGER * 6}
            label="Loans out · e.g. cards"
            rate="~21%"
            rateColor={COLORS.accent}
          />
          {/* Spread bracket */}
          <path
            d="M 820 230 L 860 230 L 860 600 L 820 600"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={6}
            strokeLinejoin="round"
            {...drawProps(bracket)}
          />
          <g opacity={bracketLabel}>
            <text
              x={920}
              y={415}
              fontSize={40}
              fontWeight={800}
              fill={COLORS.green}
              textAnchor="middle"
              transform="rotate(-90 920 415)"
              letterSpacing={4}
            >
              SPREAD
            </text>
          </g>
        </svg>
      </div>
    </SceneFrame>
  );
};
