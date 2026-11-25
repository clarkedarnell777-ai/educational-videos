import React from 'react';
import {interpolate} from 'remotion';
import {Enter, useSpring} from '../../../shared/components/motion';
import {Kicker, SceneFrame, SourceTag} from '../../../shared/components/SceneFrame';
import {COLORS, STAGGER} from '../../../shared/theme';
import data from '../script.json';
import type {SceneProps} from './types';

const C = data.scenes[2].captions;

// Bar widths show the order of the words only; the minutes give no counts.
const RUNGS = [
  {word: 'Most', meaning: 'hold rates now', at: C[0].from, w: 0.62, color: COLORS.accent},
  {word: 'Some', meaning: 'hike now', at: C[1].from, w: 0.32, color: COLORS.text},
  {word: 'Almost all', meaning: 'hikes likely ahead', at: C[2].from, w: 0.92, color: COLORS.green},
];

const Rung: React.FC<(typeof RUNGS)[number]> = ({word, meaning, at, w, color}) => {
  const s = useSpring(at);
  const bar = useSpring(at + 6);
  return (
    <div style={{opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
        <div style={{fontSize: 64, fontWeight: 800, color}}>{word}</div>
        <div style={{fontSize: 40, fontWeight: 600, color: COLORS.muted}}>{meaning}</div>
      </div>
      <div style={{height: 34, marginTop: 12, borderRadius: 17, background: COLORS.card, overflow: 'hidden'}}>
        <div style={{width: `${w * bar * 100}%`, height: '100%', borderRadius: 17, background: color, opacity: 0.9}} />
      </div>
    </div>
  );
};

export const S3How: React.FC<SceneProps> = ({captions, showSafeZone}) => {
  const foot = useSpring(C[2].from + 20);
  return (
    <SceneFrame captions={captions} showSafeZone={showSafeZone}>
      <Enter delay={0}>
        <Kicker>Decode the wording</Kicker>
      </Enter>
      <Enter delay={STAGGER}>
        <div style={{fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14}}>Three words to watch</div>
      </Enter>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 54}}>
        {RUNGS.map((r) => (
          <Rung key={r.word} {...r} />
        ))}
        <div style={{fontSize: 40, fontWeight: 800, opacity: foot, color: COLORS.text}}>
          Expectations, <span style={{color: COLORS.green}}>not decisions.</span>
        </div>
      </div>
      <Enter delay={STAGGER * 3}>
        <SourceTag>FOMC minutes, Oct 27–28 meeting (pub. Nov 18, 2026) · bars not to scale · next meeting Dec 8–9</SourceTag>
      </Enter>
    </SceneFrame>
  );
};
