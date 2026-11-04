import React from 'react';
import {interpolate} from 'remotion';
import {drawProps, Enter, useDraw, useSpring} from '../../../shared/components/motion';
import {Particles} from '../../../shared/components/Particles';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, FONT, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const NEW = data.figures.coverageNew.value; // 1.25
const VERDICT = 136; // "Under 1.25? Renegotiate."

export const S5Takeaway: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const card = useSpring(STAGGER * 2);
  const zones = useSpring(VERDICT - 26);
  const line = useDraw(VERDICT - 6, 20);
  const verdict = useSpring(VERDICT + 6);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone} background={<Particles count={12} />}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Before any offer</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          Run this one check
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34}}>
        <div
          style={{
            background: COLORS.card,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 36,
            padding: '44px 36px',
            textAlign: 'center',
            opacity: card,
            transform: `scale(${interpolate(card, [0, 1], [0.92, 1])})`,
          }}
        >
          <div style={{fontSize: 58, fontWeight: 800, color: COLORS.green}}>Last year's earnings</div>
          <div style={{height: 6, background: COLORS.text, margin: '20px 40px', borderRadius: 3}} />
          <div style={{fontSize: 58, fontWeight: 800, color: COLORS.accent}}>Loan payments</div>
        </div>
        <svg width={960} height={230} viewBox="0 0 960 230" style={{fontFamily: FONT}}>
          <g opacity={zones}>
            <rect x={0} y={70} width={480} height={100} rx={18} fill={COLORS.card} stroke={COLORS.muted} strokeWidth={3} />
            <rect x={480} y={70} width={480} height={100} rx={18} fill="rgba(34,197,94,0.22)" stroke={COLORS.green} strokeWidth={3} />
            <text x={240} y={136} textAnchor="middle" fontSize={40} fontWeight={800} fill={COLORS.muted} opacity={verdict}>
              Renegotiate
            </text>
            <text x={720} y={136} textAnchor="middle" fontSize={40} fontWeight={800} fill={COLORS.green} opacity={verdict}>
              Clears the bar
            </text>
          </g>
          <line x1={480} y1={48} x2={480} y2={186} stroke={COLORS.text} strokeWidth={8} {...drawProps(line)} />
          <text x={480} y={34} textAnchor="middle" fontSize={40} fontWeight={800} fill={COLORS.text} opacity={zones}>
            {NEW.toFixed(2)}x
          </text>
          <text x={0} y={218} fontSize={30} fontWeight={600} fill={COLORS.muted} opacity={zones}>
            Under
          </text>
          <text x={960} y={218} textAnchor="end" fontSize={30} fontWeight={600} fill={COLORS.muted} opacity={zones}>
            At or above
          </text>
        </svg>
      </div>
      <Enter delay={STAGGER * 4}>
        <SourceTag>Educational only · not financial advice · confirm with your lender</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
