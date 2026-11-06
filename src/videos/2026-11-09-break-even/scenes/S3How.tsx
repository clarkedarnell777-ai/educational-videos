import React from 'react';
import {interpolate} from 'remotion';
import {Enter, drawProps, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

const DENOM_AT = 76; // "by what each sale leaves after its own cost."

const Term: React.FC<{progress: number; color: string; children: React.ReactNode; note: string}> = ({
  progress,
  color,
  children,
  note,
}) => (
  <div style={{textAlign: 'center', opacity: progress, translate: `0px ${interpolate(progress, [0, 1], [30, 0])}px`}}>
    <div style={{fontSize: 76, fontWeight: 800, color, lineHeight: 1.1}}>{children}</div>
    <div style={{fontSize: 36, fontWeight: 400, color: COLORS.muted, marginTop: 10}}>{note}</div>
  </div>
);

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const card = useSpring(STAGGER);
  const numerator = useSpring(STAGGER * 2);
  const bar = useDraw(STAGGER * 4, 20);
  const denominator = useSpring(DENOM_AT);
  const result = useSpring(DENOM_AT + 50);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>The formula</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Sales needed</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div
          style={{
            background: COLORS.card,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 36,
            padding: '60px 40px',
            opacity: card,
            scale: interpolate(card, [0, 1], [0.94, 1]),
          }}
        >
          <Term progress={numerator} color={COLORS.accent} note="rent, insurance, software: paid every month">
            Fixed costs
          </Term>
          <svg width="100%" height={40} viewBox="0 0 880 40" preserveAspectRatio="none" style={{margin: '26px 0'}}>
            <line x1={0} y1={20} x2={880} y2={20} stroke={COLORS.text} strokeWidth={8} strokeLinecap="round" {...drawProps(bar)} />
          </svg>
          <Term progress={denominator} color={COLORS.green} note="what each sale leaves after its own cost">
            Price − Cost per sale
          </Term>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 56,
            fontWeight: 800,
            textAlign: 'center',
            opacity: result,
            translate: `0px ${interpolate(result, [0, 1], [24, 0])}px`,
          }}
        >
          = sales to <span style={{color: COLORS.green}}>break even</span>
        </div>
      </div>
      <Enter delay={STAGGER * 4}>
        <SourceTag>Per month · same idea for any product or service</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
