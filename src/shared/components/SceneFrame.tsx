import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CAPTION_H, COLORS, FONT, SAFE} from '../theme';
import {useSpring} from './motion';

export type CaptionChunk = {text: string; from: number; to: number};

const Captions: React.FC<{chunks: CaptionChunk[]}> = ({chunks}) => {
  const frame = useCurrentFrame();
  const active = chunks.find((c) => frame >= c.from && frame < c.to);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        bottom: SAFE.bottom,
        height: CAPTION_H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {active ? <CaptionLine key={active.from} chunk={active} /> : null}
    </div>
  );
};

const CaptionLine: React.FC<{chunk: CaptionChunk}> = ({chunk}) => {
  const s = useSpring(chunk.from);
  return (
    <div
      style={{
        maxWidth: '100%',
        padding: '18px 30px',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.08)',
        border: `2px solid ${COLORS.border}`,
        color: COLORS.text,
        fontSize: 42,
        fontWeight: 600,
        lineHeight: 1.25,
        textAlign: 'center',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
      }}
    >
      {chunk.text}
    </div>
  );
};

/** Background, safe-zone content column, captions and optional safe-zone overlay. */
export const SceneFrame: React.FC<{
  captions: CaptionChunk[];
  showSafeZone?: boolean;
  background?: React.ReactNode;
  children: React.ReactNode;
}> = ({captions, showSafeZone, background, children}) => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily: FONT, color: COLORS.text}}>
      {background}
      <div
        style={{
          position: 'absolute',
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom + CAPTION_H,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
      <Captions chunks={captions} />
      {showSafeZone ? (
        <div
          style={{
            position: 'absolute',
            top: SAFE.top,
            left: SAFE.side,
            right: SAFE.side,
            bottom: SAFE.bottom,
            outline: '3px dashed rgba(239,68,68,0.9)',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = COLORS.accent,
}) => (
  <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 4, color, textTransform: 'uppercase'}}>
    {children}
  </div>
);

export const SourceTag: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontSize: 28, fontWeight: 400, color: COLORS.muted, lineHeight: 1.3}}>{children}</div>
);
