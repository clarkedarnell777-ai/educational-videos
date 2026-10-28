import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const P = data.figures.examplePrincipal; // 10,000
const SAVE = Math.round(P * (data.figures.savingsRate.value / 100)); // 38
const CARD = Math.round(P * (data.figures.cardApr.value / 100)); // 2,100

const Row: React.FC<{
  title: string;
  amount: number;
  caption: string;
  color: string;
  barFraction: number;
  delay: number;
}> = ({title, amount, caption, color, barFraction, delay}) => {
  const s = useSpring(delay);
  const bar = useSpring(delay + 8);
  return (
    <div
      style={{
        background: COLORS.card,
        border: `2px solid ${COLORS.border}`,
        borderRadius: 28,
        padding: '30px 36px',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      }}
    >
      <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>{title}</div>
      <div style={{fontSize: 120, fontWeight: 800, color, lineHeight: 1.1, marginTop: 6}}>
        <CountUp to={amount} start={delay + 6} duration={40} prefix="$" />
      </div>
      <div style={{fontSize: 36, fontWeight: 400, color: COLORS.text}}>{caption}</div>
      <div style={{marginTop: 22, height: 22, borderRadius: 11, background: '#22222b', overflow: 'hidden'}}>
        <div
          style={{
            height: '100%',
            width: `${Math.max(1.2, barFraction * 100 * bar)}%`,
            background: color,
            borderRadius: 11,
          }}
        />
      </div>
    </div>
  );
};

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0} style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <Kicker>Same money, two sides</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 14}}>
          <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05}}>Same $10,000</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
              color: COLORS.bg,
              background: COLORS.green,
              borderRadius: 10,
              padding: '6px 14px',
            }}
          >
            ILLUSTRATIVE
          </div>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34}}>
        <Row
          title="In savings @ 0.38%"
          amount={SAVE}
          caption="earned per year"
          color={COLORS.green}
          barFraction={SAVE / CARD}
          delay={STAGGER * 2}
        />
        <Row
          title="Owed on a card @ 21%"
          amount={CARD}
          caption="paid in interest per year"
          color={COLORS.accent}
          barFraction={1}
          delay={STAGGER * 7}
        />
      </div>
      <Enter delay={STAGGER * 12}>
        <SourceTag>
          Illustrative: constant $10,000 balance, simple annual interest, before defaults and bank costs.
        </SourceTag>
      </Enter>
    </SceneFrame>
  );
};
