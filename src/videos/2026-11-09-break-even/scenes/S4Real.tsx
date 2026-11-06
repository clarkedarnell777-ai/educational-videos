import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const FIXED = data.figures.exampleFixedCosts.value; // $3,000 / month
const PRICE = data.figures.examplePrice.value; // $5
const UNIT_COST = data.figures.exampleUnitCost.value; // $2
const DAYS = data.figures.exampleSellingDays.value; // 30
const LEFT = PRICE - UNIT_COST; // $3 (computed)
const CUPS = FIXED / LEFT; // 1,000 (computed)
const PER_DAY = Math.ceil(CUPS / DAYS); // 34 (computed, rounded up)

const BAR_W = 860;

const Card: React.FC<{delay: number; children: React.ReactNode}> = ({delay, children}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        background: COLORS.card,
        border: `2px solid ${COLORS.border}`,
        borderRadius: 28,
        padding: '30px 34px',
        opacity: s,
        translate: `0px ${interpolate(s, [0, 1], [40, 0])}px`,
      }}
    >
      {children}
    </div>
  );
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const LEFT_AT = captions[1].from; // "$3 left per cup."
  const RESULT_AT = captions[2].from; // "That's 1,000 cups a month."
  const split = interpolate(frame, [LEFT_AT, LEFT_AT + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const leftLabel = useSpring(LEFT_AT + 10);
  const perDay = useSpring(RESULT_AT + 40);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Kicker>A coffee cart</Kicker>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
              padding: '4px 14px',
              borderRadius: 8,
              background: COLORS.green,
              color: COLORS.bg,
            }}
          >
            ILLUSTRATIVE
          </div>
        </div>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>How many cups?</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26}}>
        <Card delay={STAGGER * 2}>
          <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>Fixed costs per month</div>
          <div style={{fontSize: 96, fontWeight: 800, color: COLORS.accent}}>
            <CountUp to={FIXED} start={STAGGER * 2} duration={28} prefix="$" />
          </div>
        </Card>
        <Card delay={STAGGER * 5}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 36, fontWeight: 600, color: COLORS.muted}}>
            <span>Each cup sells for</span>
            <span style={{color: COLORS.text, fontWeight: 800}}>${PRICE}</span>
          </div>
          <div style={{position: 'relative', width: BAR_W, height: 56, marginTop: 18, borderRadius: 14, overflow: 'hidden', background: COLORS.green}}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: 56,
                width: BAR_W * (UNIT_COST / PRICE) * split,
                background: COLORS.muted,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 18,
                fontSize: 30,
                fontWeight: 800,
                color: COLORS.bg,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              ${UNIT_COST} cost
            </div>
          </div>
          <div style={{fontSize: 44, fontWeight: 800, color: COLORS.green, marginTop: 14, textAlign: 'right', opacity: leftLabel}}>
            ${LEFT} left per cup
          </div>
        </Card>
        <Card delay={RESULT_AT}>
          <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>
            ${FIXED.toLocaleString('en-US')} ÷ ${LEFT} =
          </div>
          <div style={{fontSize: 96, fontWeight: 800, color: COLORS.green}}>
            <CountUp to={CUPS} start={RESULT_AT} duration={28} /> cups
            <span style={{fontSize: 40, fontWeight: 600, color: COLORS.muted}}> a month</span>
          </div>
          <div style={{fontSize: 36, fontWeight: 600, color: COLORS.text, opacity: perDay}}>
            ≈ {PER_DAY} a day over {DAYS} days
          </div>
        </Card>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Example only: ignores taxes, owner pay and slow seasons.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
