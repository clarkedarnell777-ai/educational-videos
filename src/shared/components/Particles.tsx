import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

/** 12 subtle particles drifting upward (deterministic, seeded). */
export const Particles: React.FC<{count?: number}> = ({count = 12}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`x-${i}`) * width;
        const startY = height * (0.55 + random(`y-${i}`) * 0.5);
        const speed = 1.2 + random(`s-${i}`) * 1.8; // px per frame
        const size = 6 + random(`r-${i}`) * 10;
        const y = startY - frame * speed;
        const sway = Math.sin((frame + i * 17) / 24) * 12;
        const opacity = (0.18 + random(`o-${i}`) * 0.3) * fadeIn;
        const color = i % 3 === 0 ? COLORS.green : COLORS.accent;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: size,
              background: color,
              opacity,
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
