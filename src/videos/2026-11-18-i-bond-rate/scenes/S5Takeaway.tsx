import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {FIXED, INFLATION_PART} from './math';
import type {SceneProps} from './types';

const KEEP_AT = data.scenes[4].captions[1].from; // "That's the part you keep."

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const blocks = useSpring(6);
  const fade = interpolate(frame, [KEEP_AT - 10, KEEP_AT + 20], [1, 0.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const glow = useSpring(KEEP_AT);
  const head = useSpring(KEEP_AT + 6);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Your takeaway</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Check the fixed rate</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: blocks}}>
        <div style={{width: 560, padding: '40px 0', borderRadius: 24, background: COLORS.green, opacity: fade, textAlign: 'center', fontSize: 48, fontWeight: 800, color: COLORS.bg}}>
          Inflation {INFLATION_PART.toFixed(2)}% · changes
        </div>
        <div style={{width: 560, padding: '40px 0', borderRadius: 24, background: COLORS.accent, textAlign: 'center', fontSize: 56, fontWeight: 800, boxShadow: `0 0 ${80 * glow}px ${COLORS.accent}`}}>
          Fixed {FIXED.toFixed(2)}% · yours
        </div>
        <div style={{fontSize: 56, fontWeight: 800, marginTop: 30, textAlign: 'center', opacity: head, transform: `translateY(${interpolate(head, [0, 1], [24, 0])}px)`}}>
          It's the part <span style={{color: COLORS.green}}>you keep.</span>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Educational only, not financial advice.</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
