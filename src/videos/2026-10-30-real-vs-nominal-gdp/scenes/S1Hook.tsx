import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const NOMINAL = data.figures.nominalGdp.value; // 5.6
const REAL = data.figures.realGdp.value; // 3.4

const BigNumber: React.FC<{value: number; label: string; color: string; delay: number}> = ({
  value,
  label,
  color,
  delay,
}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        width: 400,
        padding: '44px 20px 36px',
        borderRadius: 36,
        background: COLORS.card,
        border: `3px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
      }}
    >
      <div style={{fontSize: 150, fontWeight: 800, color, lineHeight: 1}}>
        <CountUp to={value} start={delay} duration={36} decimals={1} suffix="%" />
      </div>
      <div style={{fontSize: 36, fontWeight: 600, color: COLORS.text, marginTop: 18}}>{label}</div>
    </div>
  );
};

const PulsingQuestion: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const s = useSpring(delay);
  const pulse = 1 + 0.08 * Math.sin(Math.max(0, frame - delay) / 6);
  return (
    <div
      style={{
        fontSize: 140,
        fontWeight: 800,
        color: COLORS.muted,
        opacity: s,
        transform: `scale(${s * pulse})`,
      }}
    >
      ?
    </div>
  );
};

export const S1Hook: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>U.S. GDP · Q3 2026</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          How fast did the economy grow?
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
          <BigNumber value={NOMINAL} label="one answer" color={COLORS.accent} delay={STAGGER * 2} />
          <PulsingQuestion delay={STAGGER * 4} />
          <BigNumber value={REAL} label="another answer" color={COLORS.green} delay={STAGGER * 3} />
        </div>
        <Enter delay={STAGGER * 6} style={{textAlign: 'center'}}>
          <div style={{fontSize: 56, fontWeight: 800}}>Both are official.</div>
        </Enter>
      </div>
      <Enter delay={STAGGER * 7}>
        <SourceTag>BEA advance estimate, Q3 2026 (Jul–Sep), annual rates · published Oct 29, 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
