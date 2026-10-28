import React from 'react';
import {interpolate} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import type {SceneProps} from './types';

const CheckItem: React.FC<{text: string; delay: number}> = ({text, delay}) => {
  const s = useSpring(delay);
  const check = useDraw(delay + 8, 18);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        background: COLORS.card,
        border: `2px solid ${COLORS.border}`,
        borderRadius: 28,
        padding: '30px 34px',
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-50, 0])}px)`,
      }}
    >
      <svg width={84} height={84} viewBox="0 0 84 84" style={{flexShrink: 0}}>
        <circle cx={42} cy={42} r={38} fill="none" stroke={COLORS.green} strokeWidth={5} {...drawProps(check)} />
        <path
          d="M 24 44 L 37 57 L 61 30"
          fill="none"
          stroke={COLORS.green}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...drawProps(check)}
        />
      </svg>
      <div style={{fontSize: 48, fontWeight: 600, lineHeight: 1.15}}>{text}</div>
    </div>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your move</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Get on the right side of the spread
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
        <CheckItem text="Compare your savings APY" delay={STAGGER * 2} />
        <CheckItem text="Pay card balances in full each month" delay={STAGGER * 3} />
        <Enter delay={STAGGER * 5}>
          <div style={{fontSize: 40, fontWeight: 400, color: COLORS.muted, marginTop: 20, lineHeight: 1.3}}>
            Which side of the spread is your money on?
          </div>
        </Enter>
      </div>
      <Enter delay={STAGGER * 6}>
        <SourceTag>Educational only · not financial advice</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
