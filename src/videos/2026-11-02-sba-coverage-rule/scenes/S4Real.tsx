import React from 'react';
import {interpolate} from 'remotion';
import {CountUp, Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const DEAL = data.figures.exampleDeal.value; // 500,000
const EQUITY = (DEAL * data.figures.equityMinPct.value) / 100; // 50,000 (computed)
const REST = DEAL - EQUITY; // 450,000 (computed)
const SELLER_MAX = EQUITY * data.figures.sellerMaxShare.value; // 25,000 (computed)
const BUYER_MIN = EQUITY - SELLER_MAX; // 25,000 (computed)

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const BAR_W = 960;
const SPLIT = 124; // "Seller financing covers half, at most."

const Half: React.FC<{title: string; amount: number; color: string; textColor: string; delay: number}> = ({
  title,
  amount,
  color,
  textColor,
  delay,
}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        flex: 1,
        height: 250,
        borderRadius: 26,
        background: color,
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      }}
    >
      <div style={{fontSize: 36, fontWeight: 600, textAlign: 'center', lineHeight: 1.15}}>{title}</div>
      <div style={{fontSize: 64, fontWeight: 800, marginTop: 10}}>{usd(amount)}</div>
    </div>
  );
};

export const S4Real: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const bar = useSpring(STAGGER * 2);
  const slice = useSpring(58);
  const link = useSpring(84);
  const eqW = BAR_W * (EQUITY / DEAL);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker color={COLORS.green}>Illustrative</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>
          A <CountUp to={DEAL} start={STAGGER} duration={34} prefix="$" /> deal
        </div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22}}>
        <div style={{display: 'flex', width: BAR_W * bar, height: 170, gap: 8 * slice}}>
          <div
            style={{
              flex: 1,
              borderRadius: 20,
              background: COLORS.card,
              border: `3px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              fontWeight: 600,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {usd(REST)} financed
          </div>
          <div style={{width: eqW * slice, borderRadius: 20, background: COLORS.green}} />
        </div>
        <div style={{textAlign: 'right', opacity: slice}}>
          <div style={{fontSize: 44, fontWeight: 800, color: COLORS.green}}>
            10% minimum down = {usd(EQUITY)}
          </div>
        </div>
        <svg width={960} height={70} viewBox="0 0 960 70" style={{opacity: link}}>
          <path d="M 912 0 L 912 30 L 40 30 L 40 70 M 912 30 L 912 70" fill="none" stroke={COLORS.green} strokeWidth={4} />
        </svg>
        <div style={{display: 'flex', gap: 24}}>
          <Half title="Buyer's own funds, at least" amount={BUYER_MIN} color={COLORS.green} textColor={COLORS.bg} delay={SPLIT} />
          <Half title="Seller financing, at most" amount={SELLER_MAX} color={COLORS.accent} textColor={COLORS.text} delay={SPLIT + STAGGER} />
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>Project cost = price · Starfield & Smith, Sep 9, 2026</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
