import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import {CONSTANT, DEBT_SERVICE, LOAN, PAYMENT, RATE, usd} from './math';
import type {SceneProps} from './types';

const Step: React.FC<{progress: number; label: string; children: React.ReactNode}> = ({progress, label, children}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '22px 0',
      borderTop: `2px solid ${COLORS.border}`,
      opacity: progress,
      translate: `0px ${interpolate(progress, [0, 1], [24, 0])}px`,
    }}
  >
    <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>{label}</div>
    <div style={{fontSize: 64, fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>{children}</div>
  </div>
);

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const paymentsAt = captions[1].from; // "yearly payments over the loan."
  const constantAt = captions[2].from; // "At 7.18%, that's about 8.1%."
  const card = useSpring(STAGGER * 2);
  const monthly = useSpring(paymentsAt);
  const yearly = useSpring(paymentsAt + STAGGER * 2);
  const result = useSpring(constantAt + 24);
  const highlight = interpolate(frame, [constantAt + 24, constantAt + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The loan's number</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Loan constant</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div
          style={{
            background: COLORS.card,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 36,
            padding: '40px 44px 20px',
            opacity: card,
            translate: `0px ${interpolate(card, [0, 1], [40, 0])}px`,
          }}
        >
          <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>30-year loan</div>
          <div style={{fontSize: 88, fontWeight: 800, marginBottom: 20}}>
            {usd(LOAN)} <span style={{color: COLORS.accent}}>at {RATE}%</span>
          </div>
          <Step progress={monthly} label="Payment per month">
            {usd(PAYMENT)}
          </Step>
          <Step progress={yearly} label="Payments per year">
            {usd(DEBT_SERVICE)}
          </Step>
          <Step progress={result} label="Share of the loan, per year">
            <span style={{color: highlight > 0.5 ? COLORS.accent : COLORS.text}}>
              <CountUp to={CONSTANT} start={constantAt + 24} duration={24} decimals={1} suffix="%" />
            </span>
          </Step>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Avg 30-yr fixed rate, Freddie Mac PMMS, Nov 5, 2026 · owner-occupied; investor loans can cost more</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
