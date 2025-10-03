import { StrategyInputValues } from 'hooks/useStrategyInput';
import { SimulatorData, SimulatorReturn } from 'libs/queries';
import { SimulatorResultSearch } from 'libs/routing';
import { createContext, useContext } from 'react';
import { PlaybackSpeed } from './SimulatorProvider';

export const playbackSpeedOptions = ['0.1x', '0.5x', '1x', '2x', '4x'] as const;

export type SimulationStatus = 'running' | 'paused' | 'ended' | 'idle';

interface SimulatorProviderCTX extends Partial<SimulatorReturn> {
  search: SimulatorResultSearch;
  state: StrategyInputValues;
  status: SimulationStatus;
  start: () => void;
  end: () => void;
  replay: () => void;
  pause: () => void;
  unpause: () => void;
  onBrush: (frame: number) => void;
  onBrushEnd: () => void;
  animationData: SimulatorData[];
  isPending: boolean;
  isError: boolean;
  errorMsg?: string;
  isSuccess: boolean;
  timer: string;
  playbackSpeed: PlaybackSpeed;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
}

export const SimulatorCTX = createContext<SimulatorProviderCTX | undefined>(
  undefined,
);
export const useSimulator = () => {
  const ctx = useContext(SimulatorCTX);
  if (ctx === null || ctx === undefined) {
    throw new Error('No context found for simulator provider.');
  }
  return ctx;
};
