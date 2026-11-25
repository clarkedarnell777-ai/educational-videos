import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {BALANCE, HIKE_PER_MONTH, HIKE_PER_YEAR, HIKE_PTS} from './math';
import type {SceneProps} from './types';

const C = data.scenes[3].captions;
const SLIDE_AT = C[1].from;
const COST_AT = C[2].from;

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const frame = useCurrentFrame();
  const card = useSpring(C[0].from);
  const knob = interpolate(frame, [SLIDE_AT, SLIDE_AT + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cost = useSpring(COST_AT);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <div style={{alignSelf: 'flex-start', display: 'inline-block', padding: '8px 22px', borderRadius: 999, background: COLORS.accent, fontSize: 30, fontWeight: 800}}>
          Illustrative
        </div>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 18}}>One quarter-point hike</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40}}>
        <div style={{padding: 40, borderRadius: 28, background: COLORS.card, border: `3px solid ${COLORS.border}`, opacity: card, transform: `translateY(${interpolate(card, [0, 1], [40, 0])}px)`}}>
          <Kicker>Home equity line</Kicker>
          <div style={{fontSize: 96, fontWeight: 800, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>
            ${BALANCE.toLocaleString('en-US')}
          </div>
          <div style={{fontSize: 36, color: COLORS.muted, fontWeight: 600}}>balance, variable rate</div>
          <svg width={880} height={120} viewBox="0 0 880 120" style={{marginTop: 24, fontFamily: FONT}}>
            <rect x={20} y={50} width={840} height={16} rx={8} fill={COLORS.border} />
            <rect x={20} y={50} width={420 + 260 * knob} height={16} rx={8} fill={COLORS.accent} />
            <circle cx={440 + 260 * knob} cy={58} r={26} fill={COLORS.text} />
            <text x={440} y={30} textAnchor="middle" fontSize={30} fontWeight={600} fill={COLORS.muted}>today</text>
            <text x={700} y={110} textAnchor="middle" fontSize={30} fontWeight={800} fill={COLORS.green} opacity={knob}>
              +{HIKE_PTS.toFixed(2)} pt
            </text>
          </svg>
        </div>
        <div style={{textAlign: 'center', opacity: cost}}>
          <div style={{fontSize: 120, fontWeight: 800, color: COLORS.green}}>
            +<CountUp to={HIKE_PER_YEAR} start={COST_AT} duration={30} prefix="$" />
            <span style={{fontSize: 56}}> / year</span>
          </div>
          <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted}}>≈ ${HIKE_PER_MONTH.toFixed(2)} more per month</div>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Interest only, constant balance · real terms vary by lender</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
