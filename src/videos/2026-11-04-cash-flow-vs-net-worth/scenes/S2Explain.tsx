import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

const MOVIE = 88; // "Cash flow is the movie"
const PANEL_W = 464;
const PANEL_H = 640;

const Panel: React.FC<{title: string; sub: string; color: string; delay: number; children: React.ReactNode}> = ({
  title,
  sub,
  color,
  delay,
  children,
}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        width: PANEL_W,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
      }}
    >
      <div style={{fontSize: 52, fontWeight: 800, color}}>{title}</div>
      <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted, marginBottom: 20}}>{sub}</div>
      {children}
    </div>
  );
};

const Snapshot: React.FC = () => {
  const assets = useSpring(STAGGER * 4);
  const debts = useSpring(STAGGER * 6);
  const equals = useSpring(STAGGER * 8);
  const row: React.CSSProperties = {fontSize: 44, fontWeight: 800, padding: '26px 10px', textAlign: 'center'};
  return (
    <div
      style={{
        height: PANEL_H,
        boxSizing: 'border-box',
        padding: 26,
        background: COLORS.text,
        borderRadius: 12,
        display: 'flex',
      }}
    >
      <div
        style={{
          flex: 1,
          background: COLORS.card,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: COLORS.text,
        }}
      >
        <div style={{...row, opacity: assets, color: COLORS.accent}}>What you own</div>
        <div style={{...row, opacity: debts}}>minus</div>
        <div style={{...row, opacity: debts, color: COLORS.muted}}>What you owe</div>
        <div style={{height: 5, margin: '6px 26px', background: COLORS.text, opacity: equals}} />
        <div style={{...row, opacity: equals}}>One moment in time</div>
      </div>
    </div>
  );
};

const Filmstrip: React.FC = () => {
  const frame = useCurrentFrame();
  const inArrow = useDraw(MOVIE + 24, 22);
  const outArrow = useDraw(MOVIE + 46, 22);
  const scroll = (frame * 2.4) % 80;
  return (
    <svg width={PANEL_W} height={PANEL_H} viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} style={{fontFamily: FONT}}>
      <rect x={0} y={0} width={PANEL_W} height={PANEL_H} rx={12} fill={COLORS.card} stroke={COLORS.border} strokeWidth={3} />
      {new Array(10).fill(0).map((_, i) => (
        <React.Fragment key={i}>
          <rect x={14} y={i * 80 - 70 + scroll} width={30} height={44} rx={6} fill={COLORS.border} />
          <rect x={PANEL_W - 44} y={i * 80 - 70 + scroll} width={30} height={44} rx={6} fill={COLORS.border} />
        </React.Fragment>
      ))}
      <text x={PANEL_W / 2} y={190} textAnchor="middle" fontSize={44} fontWeight={800} fill={COLORS.green}>
        Money in
      </text>
      <path d="M 232 30 L 232 130 M 192 92 L 232 132 L 272 92" fill="none" stroke={COLORS.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" {...drawProps(inArrow)} />
      <text x={PANEL_W / 2} y={460} textAnchor="middle" fontSize={44} fontWeight={800} fill={COLORS.muted}>
        Money out
      </text>
      <path d="M 232 500 L 232 610 M 192 572 L 232 612 L 272 572" fill="none" stroke={COLORS.muted} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" {...drawProps(outArrow)} />
    </svg>
  );
};

export const S2Explain: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Two different questions</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          One photo, one movie
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Panel title="Net worth" sub="the snapshot" color={COLORS.accent} delay={STAGGER * 2}>
          <Snapshot />
        </Panel>
        <Panel title="Cash flow" sub="the movie" color={COLORS.green} delay={MOVIE}>
          <Filmstrip />
        </Panel>
      </div>
    </SceneFrame>
  );
};
