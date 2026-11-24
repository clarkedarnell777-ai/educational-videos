import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {DAYS_LOST} from './math';
import type {SceneProps} from './types';

const ASK_AT = data.scenes[4].captions[1].from; // "Selling late? Ask your tax pro..."

const Item: React.FC<{text: string; at: number}> = ({text, at}) => {
  const s = useSpring(at);
  const tick = useDraw(at + 8, 14);
  return (
    <div style={{display: 'flex', gap: 24, alignItems: 'center', padding: '22px 0', borderTop: `2px solid ${COLORS.border}`, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`}}>
      <svg width={64} height={64} viewBox="0 0 64 64" style={{flexShrink: 0}}>
        <rect x={4} y={4} width={56} height={56} rx={12} fill="none" stroke={COLORS.green} strokeWidth={5} />
        <path d="M 16 33 L 27 44 L 48 20" fill="none" stroke={COLORS.green} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" {...drawProps(tick)} />
      </svg>
      <div style={{fontSize: 40, fontWeight: 600, lineHeight: 1.2}}>{text}</div>
    </div>
  );
};

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const card = useSpring(ASK_AT - 6);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your takeaway</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 96, fontWeight: 800, lineHeight: 1.05, marginTop: 14, color: '#ef4444'}}>
          <CountUp to={DAYS_LOST} start={14} duration={28} /> days gone
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{padding: '36px 40px 12px', borderRadius: 32, background: COLORS.card, border: `3px solid ${COLORS.accent}`, opacity: card, transform: `scale(${interpolate(card, [0, 1], [0.92, 1])})`}}>
          <div style={{fontSize: 60, fontWeight: 800, marginBottom: 18}}>Sold after Oct 17?</div>
          <Item text="Ask your tax pro about an extension (Form 4868)" at={ASK_AT + 4} />
          <Item text="Mark day 45 and day 180 on your calendar" at={ASK_AT + 4 + STAGGER} />
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Educational only, not financial or tax advice.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
