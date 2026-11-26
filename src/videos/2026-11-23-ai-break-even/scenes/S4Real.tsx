import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import {LARGE_FIRMS, NO_HEADCOUNT_CHANGE, SMALL_FIRMS_CAP} from './math';
import type {SceneProps} from './types';

const C = data.scenes[3].captions;
const BARS_AT = C[0].from;
const DONUT_AT = C[1].from; // "96% of AI-using firms"
const LABEL_AT = C[2].from; // "reported no headcount change"

const BAR_MAX = 600; // px for 50%
const SIZES = [
  {label: '250+ employees', value: LARGE_FIRMS, text: `${LARGE_FIRMS}%`, color: COLORS.accent},
  {label: '1–4 employees', value: SMALL_FIRMS_CAP, text: `under ${SMALL_FIRMS_CAP}%`, color: COLORS.muted},
];

const Bar: React.FC<(typeof SIZES)[number] & {i: number}> = ({label, value, text, color, i}) => {
  const s = useSpring(BARS_AT + i * STAGGER);
  const w = useSpring(BARS_AT + i * STAGGER + 6);
  return (
    <div style={{opacity: s}}>
      <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted}}>{label}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 8}}>
        <div style={{width: (value / 50) * BAR_MAX * w, height: 48, borderRadius: 12, background: color}} />
        <div style={{fontSize: 44, fontWeight: 800, color: i === 0 ? COLORS.text : COLORS.muted}}>{text}</div>
      </div>
    </div>
  );
};

const R = 150;

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const donut = useSpring(DONUT_AT - 4);
  const arc = useDraw(DONUT_AT, 40);
  const label = useSpring(LABEL_AT);
  const fillShare = (NO_HEADCOUNT_CHANGE / 100) * arc;
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Real-world use</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Not about cutting staff</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 50}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
          <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 3, color: COLORS.accent}}>WHO USES AI, BY FIRM SIZE</div>
          {SIZES.map((b, i) => (
            <Bar key={b.label} {...b} i={i} />
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 40, opacity: donut, transform: `scale(${interpolate(donut, [0, 1], [0.92, 1])})`}}>
          <svg width={360} height={360} viewBox="0 0 360 360" style={{fontFamily: FONT, flexShrink: 0}}>
            <circle cx={180} cy={180} r={R} fill="none" stroke={COLORS.border} strokeWidth={40} />
            <circle
              cx={180}
              cy={180}
              r={R}
              fill="none"
              stroke={COLORS.green}
              strokeWidth={40}
              strokeLinecap="butt"
              transform="rotate(-90 180 180)"
              {...drawProps(fillShare)}
            />
            <foreignObject x={60} y={130} width={240} height={110}>
              <div style={{textAlign: 'center'}}>
                <CountUp to={NO_HEADCOUNT_CHANGE} start={DONUT_AT} duration={40} suffix="%" style={{fontSize: 84, fontWeight: 800, color: COLORS.green}} />
              </div>
            </foreignObject>
          </svg>
          <div style={{opacity: label, transform: `translateX(${interpolate(label, [0, 1], [30, 0])}px)`}}>
            <div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.1}}>No headcount change</div>
            <div style={{fontSize: 36, fontWeight: 600, color: COLORS.muted, marginTop: 10}}>AI-using firms, prior 6 months</div>
          </div>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Census BTOS (Dec 2025–May 2026); AI supplement Apr 2026 via Minneapolis Fed, May 29, 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
