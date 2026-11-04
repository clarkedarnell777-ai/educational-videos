import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const NET_WORTH = data.figures.medianNetWorth.value; // 215,900
const BALANCE = data.figures.medianBalance.value; // 8,200
const LATE = data.figures.latePayments.value; // 19.6

const FULL = 860; // px for the $215,900 bar; the $8,200 bar shares this scale
const T1 = 30;
const T2 = 110;
const T3 = 187;

const StatCard: React.FC<{delay: number; children: React.ReactNode}> = ({delay, children}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        padding: '26px 34px',
        borderRadius: 28,
        background: COLORS.card,
        border: `2px solid ${COLORS.border}`,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>{children}</div>
);

const ScaledBar: React.FC<{share: number; color: string; start: number}> = ({share, color, start}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{width: FULL * share * p, height: 30, borderRadius: 8, background: color, marginTop: 14}} />;
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Fed Survey of Consumer Finances · 2025</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 66, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Rich on paper, tight on cash</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22}}>
        <StatCard delay={T1}>
          <Label>Median net worth</Label>
          <div style={{fontSize: 88, fontWeight: 800, color: COLORS.accent}}>
            <CountUp to={NET_WORTH} start={T1} duration={32} prefix="$" />
          </div>
          <ScaledBar share={1} color={COLORS.accent} start={T1} />
        </StatCard>
        <StatCard delay={T2}>
          <Label>Median bank balance</Label>
          <div style={{fontSize: 88, fontWeight: 800, color: COLORS.green}}>
            <CountUp to={BALANCE} start={T2} duration={28} prefix="$" />
          </div>
          <ScaledBar share={BALANCE / NET_WORTH} color={COLORS.green} start={T2} />
        </StatCard>
        <StatCard delay={T3}>
          <Label>Late on loan payments</Label>
          <div style={{fontSize: 88, fontWeight: 800}}>
            <CountUp to={LATE} start={T3} duration={28} decimals={1} suffix="%" />
            <span style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}> of families</span>
          </div>
        </StatCard>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Released Oct 9, 2026 · Separate measures, not one family · Balance among account holders</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
