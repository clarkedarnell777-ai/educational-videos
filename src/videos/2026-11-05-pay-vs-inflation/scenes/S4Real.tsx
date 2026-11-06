import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const SALARY = data.figures.exampleSalary.value; // 60,000
const RAISE = Math.round((SALARY * data.figures.wageGrowth.value) / 100); // 1,800 (computed)
const NEEDED = Math.round((SALARY * data.figures.cpiGrowth.value) / 100); // 2,220 (computed)
const GAP = NEEDED - RAISE; // 420 (computed)

const [SALARY_AT, RAISE_AT, NEEDED_AT, SHORT_AT] = data.scenes[3].captions.map((c) => c.from);
const BAR_W = 960;
const PX = BAR_W / 2400; // px per dollar, shared by both bars

const Bar: React.FC<{label: string; value: number; start: number; color: string}> = ({label, value, start, color}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + 32], [0, value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{opacity: frame >= start ? 1 : 0, marginBottom: 44}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14}}>
        <span style={{fontSize: 44, fontWeight: 600}}>{label}</span>
        <CountUp to={value} start={start} duration={32} prefix="$" style={{fontSize: 64, fontWeight: 800, color}} />
      </div>
      <div style={{width: BAR_W, height: 90, background: COLORS.card, borderRadius: 18}}>
        <div style={{width: v * PX, height: '100%', background: color, borderRadius: 18}} />
      </div>
    </div>
  );
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const short = useSpring(SHORT_AT);
  const pulse = 1 + 0.04 * Math.sin(Math.max(0, frame - SHORT_AT - 20) / 5) * (frame > SHORT_AT + 20 ? 1 : 0);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Illustrative</Kicker>
      </Enter>
      <Enter delay={SALARY_AT}>
        <div style={{fontSize: 34, fontWeight: 600, color: COLORS.muted, marginTop: 14}}>Salary</div>
        <CountUp to={SALARY} start={SALARY_AT} duration={30} prefix="$" style={{fontSize: 120, fontWeight: 800, lineHeight: 1}} />
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Bar label={`${data.figures.wageGrowth.value.toFixed(1)}% raise`} value={RAISE} start={RAISE_AT} color={COLORS.green} />
        <Bar label={`Needed to match ${data.figures.cpiGrowth.value}% prices`} value={NEEDED} start={NEEDED_AT} color={COLORS.text} />
        <div
          style={{
            alignSelf: 'center',
            marginTop: 20,
            padding: '24px 48px',
            borderRadius: 28,
            border: `4px solid ${COLORS.accent}`,
            background: 'rgba(99,102,241,0.15)',
            opacity: short,
            transform: `scale(${interpolate(short, [0, 1], [0.8, 1]) * pulse})`,
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 88, fontWeight: 800, color: COLORS.text, fontVariantNumeric: 'tabular-nums'}}>
            ${GAP.toLocaleString('en-US')} short
          </div>
          <div style={{fontSize: 34, fontWeight: 600, color: COLORS.muted}}>in buying power for the year</div>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Example math, before taxes · real raises and prices vary</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
