import React from 'react';
import {Composition, Folder} from 'remotion';
import {VIDEOS} from './videos';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {VIDEOS.map(({slug, component, data}) => {
        const sum = data.scenes.reduce((s, x) => s + x.frames, 0);
        const total = sum - data.transitionFrames * (data.scenes.length - 1);
        if (total !== data.totalFrames) {
          throw new Error(`${slug}: scenes add up to ${total} frames, expected ${data.totalFrames}`);
        }
        const common = {
          component,
          durationInFrames: total,
          fps: data.fps,
          width: data.width,
          height: data.height,
        };
        return (
          <Folder key={slug} name={slug.replace(/[^a-zA-Z0-9-]/g, '-')}>
            <Composition id={data.id} {...common} defaultProps={{withAudio: false, showSafeZone: false}} />
            <Composition
              id={`${data.id}-SafeZoneCheck`}
              {...common}
              defaultProps={{withAudio: false, showSafeZone: true}}
            />
          </Folder>
        );
      })}
    </>
  );
};
