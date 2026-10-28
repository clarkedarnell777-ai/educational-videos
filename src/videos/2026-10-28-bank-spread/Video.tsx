import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import data from './script.json';
import {COLORS} from '../../shared/theme';
import {S1Hook} from './scenes/S1Hook';
import {S2Explain} from './scenes/S2Explain';
import {S3How} from './scenes/S3How';
import {S4Real} from './scenes/S4Real';
import {S5Takeaway} from './scenes/S5Takeaway';
import type {SceneProps} from './scenes/types';

export type BankSpreadProps = {
  /** Set true once public/voiceover.mp3 exists. */
  withAudio: boolean;
  /** Draw the safe-zone outline (for review only, never for the final render). */
  showSafeZone: boolean;
};

const SCENES: Record<string, React.FC<SceneProps>> = {
  hook: S1Hook,
  explain: S2Explain,
  how: S3How,
  real: S4Real,
  takeaway: S5Takeaway,
};

export const BankSpread: React.FC<BankSpreadProps> = ({withAudio, showSafeZone}) => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <TransitionSeries>
        {data.scenes.map((scene, i) => {
          const Scene = SCENES[scene.key];
          return (
            <React.Fragment key={scene.key}>
              {i > 0 ? (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({durationInFrames: data.transitionFrames})}
                />
              ) : null}
              <TransitionSeries.Sequence durationInFrames={scene.frames}>
                <Scene captions={scene.captions} showSafeZone={showSafeZone} />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      {withAudio ? <Audio src={staticFile('2026-10-28-bank-spread/voiceover.mp3')} /> : null}
    </AbsoluteFill>
  );
};
