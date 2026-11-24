import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {COMPOSITE, PRINCIPAL, SIX_MONTH_INTEREST} from './math';
import type {SceneProps} from './types';

const C = data.scenes[3].captions;
const EARN_AT = C[1].from; // "about $275 in six months."
const HOLD_AT = C[2].from; // "You can't cash out for a year."

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const ring = useDraw(14, EARN_AT + 30 - 14);
  const hold = useSpring(HOLD_AT);
  const lock = useDraw(HOLD_AT + 8, 18);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
          <Kicker>Six months of interest</Kicker>
          <div style={{fontSize: 28, fontWeight: 800, color: COLORS.bg, background: COLORS.green, borderRadius: 10, padding: '4px 14px'}}>ILLUSTRATIVE</div>
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40}}>
        <div style={{position: 'relative', width: 520, height: 520}}>
          <svg width={520} height={520} viewBox="0 0 520 520" style={{fontFamily: FONT}}>
            <circle cx={260} cy={260} r={230} fill="none" stroke={COLORS.border} strokeWidth={20} />
            <circle cx={260} cy={260} r={230} fill="none" stroke={COLORS.green} strokeWidth={20} strokeLinecap="round" transform="rotate(-90 260 260)" {...drawProps(ring)} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>${PRINCIPAL.toLocaleString('en-US')} at {COMPOSITE.toFixed(2)}%</div>
            <CountUp to={PRINCIPAL + SIX_MONTH_INTEREST} start={20} duration={EARN_AT + 30 - 20} decimals={2} prefix="$" style={{fontSize: 84, fontWeight: 800}} />
            <CountUp to={SIX_MONTH_INTEREST} start={EARN_AT} duration={30} decimals={2} prefix="+$" style={{fontSize: 60, fontWeight: 800, color: COLORS.green}} />
            <div style={{fontSize: 32, fontWeight: 600, color: COLORS.muted}}>after 6 months</div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 28, alignItems: 'center', width: '100%', padding: '28px 34px', borderRadius: 28, background: COLORS.card, border: `3px solid ${COLORS.accent}`, opacity: hold, transform: `translateY(${interpolate(hold, [0, 1], [30, 0])}px)`}}>
          <svg width={70} height={90} viewBox="0 0 70 90" style={{flexShrink: 0}}>
            <path d="M 14 40 L 14 24 A 21 21 0 0 1 56 24 L 56 40" fill="none" stroke={COLORS.accent} strokeWidth={7} {...drawProps(lock)} />
            <rect x={2} y={40} width={66} height={48} rx={10} fill={COLORS.accent} />
          </svg>
          <div>
            <div style={{fontSize: 44, fontWeight: 800}}>12-month minimum hold</div>
            <div style={{fontSize: 32, fontWeight: 600, color: COLORS.muted}}>Cash out before 5 yrs: lose 3 months' interest</div>
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>$10,000 × 5.51% ÷ 2 · rate resets May 2027 · 31 CFR 359.6–359.7</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
