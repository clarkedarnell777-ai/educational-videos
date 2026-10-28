import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Spring progress (0→1) with damping 200, starting at `delay` frames. */
export const useSpring = (delay = 0): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: Math.max(0, frame - delay), fps, config: {damping: 200}});
};

/** Every entering element goes through this: spring({damping: 200}) fade + rise. */
export const Enter: React.FC<{
  delay?: number;
  rise?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({delay = 0, rise = 40, style, children}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [rise, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Number that counts up with interpolate(), rendered with tabular-nums. */
export const CountUp: React.FC<{
  to: number;
  start: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({to, start, duration = 36, decimals = 0, prefix = '', suffix = '', style}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + duration], [0, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const text = v.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
};

/** Progress for SVG stroke-dashoffset drawing (use with pathLength={1}). */
export const useDraw = (start: number, duration = 24): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
};

export const drawProps = (progress: number) => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - progress,
});
