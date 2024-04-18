import {
  StrategyInputValues,
  buildStrategyInputState,
} from 'hooks/useStrategyInput';
import { useTokens } from 'hooks/useTokens';
import { SimulatorData, SimulatorReturn, useGetSimulator } from 'libs/queries';
import { SimulatorResultSearch, useSearch } from 'libs/routing';
import { isNil } from 'lodash';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { wait } from 'utils/helpers';

type SimulationStatus = 'running' | 'paused' | 'ended' | 'idle';

interface SimulatorProviderCTX extends Partial<SimulatorReturn> {
  search: SimulatorResultSearch;
  state: StrategyInputValues;
  status: SimulationStatus;
  start: () => void;
  end: () => void;
  pause: () => void;
  unpause: () => void;
  onBrush: (frame: number) => void;
  onBrushEnd: () => void;
  animationData: SimulatorData[];
  isLoading: boolean;
  isError: boolean;
  errorMsg?: string;
  isSuccess: boolean;
  timer: string;
  playbackSpeed: PlaybackSpeed;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
}

const SimulatorCTX = createContext<SimulatorProviderCTX | undefined>(undefined);

export const useSimulator = () => {
  const ctx = useContext(SimulatorCTX);
  if (isNil(ctx)) {
    throw new Error('No context found for simulator provider.');
  }
  return ctx;
};

interface SimulatorProviderProps {
  children: ReactNode;
}

const times: number[] = [];

export const playbackSpeedOptions = ['0.1x', '0.5x', '1x', '2x', '4x'] as const;

const playbackSpeedMap: Record<PlaybackSpeed, number> = {
  '0.1x': 1000,
  '0.5x': 50,
  '1x': 25,
  '2x': 10,
  '4x': 5,
};

export type PlaybackSpeed = (typeof playbackSpeedOptions)[number];

export const SimulatorProvider: FC<SimulatorProviderProps> = ({ children }) => {
  const search = useSearch({ from: '/simulate/result' });
  const tokens = useTokens();
  const baseToken = tokens.getTokenById(search.baseToken);
  const quoteToken = tokens.getTokenById(search.quoteToken);
  const state = buildStrategyInputState(search, baseToken, quoteToken);
  const query = useGetSimulator(search);
  const [animationData, setAnimationData] = useState<SimulatorData[]>([]);
  const [timer, setTimer] = useState('');
  const status = useRef<SimulationStatus>('idle');
  const animationFrame = useRef<number>(0);
  const playbackSpeed = useRef<PlaybackSpeed>('1x');
  const actionAfterBrushEnd = useRef<'run' | 'pause' | undefined>();

  const setPlaybackSpeed = (speed: PlaybackSpeed) => {
    playbackSpeed.current = speed;
    setAnimationData((prev) => [...prev]);
  };

  const handleFPS = () => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);

    setTimer(`${times.length} fps`);
  };

  const handleAnimationStep = useCallback(async () => {
    if (!query.data) {
      console.error('Simulator animation canceled, no data found.');
      return;
    }

    if (status.current === 'paused' || status.current === 'ended') {
      console.log('Simulator animation canceled, paused or ended.');
      return;
    }

    handleFPS();

    const perFrame = 1;
    const startSlice = perFrame * animationFrame.current;
    const endSlice = startSlice + perFrame;

    animationFrame.current = animationFrame.current + 1;

    if (endSlice >= query.data.data.length) {
      status.current = 'ended';
      setAnimationData(query.data.data);
      return;
    }

    setAnimationData(query.data.data.slice(0, endSlice));
    await wait(playbackSpeedMap[playbackSpeed.current]);
    requestAnimationFrame(handleAnimationStep);
  }, [query.data, status]);

  const start = useCallback(() => {
    if (status.current === 'running') {
      return;
    }
    setAnimationData([]);
    animationFrame.current = 0;
    status.current = 'running';
    handleAnimationStep();
  }, [handleAnimationStep]);

  const pause = () => {
    status.current = 'paused';
    setAnimationData((prev) => [...prev]);
  };

  const unpause = () => {
    status.current = 'running';
    handleAnimationStep();
  };

  const end = () => {
    status.current = 'ended';
    setAnimationData(query.data?.data || []);
  };

  const onBrush = (frame: number) => {
    if (!actionAfterBrushEnd.current) {
      if (status.current === 'running') {
        actionAfterBrushEnd.current = 'run';
      } else {
        actionAfterBrushEnd.current = 'pause';
      }
    }
    status.current = 'paused';
    animationFrame.current = frame;
    const data = query.data?.data || [];
    if (frame === data.length) {
      status.current = 'ended';
    }
    setAnimationData(data.slice(0, frame));
  };

  const onBrushEnd = () => {
    if (!actionAfterBrushEnd.current) {
      return;
    }
    if (actionAfterBrushEnd.current === 'run') {
      status.current = 'running';
      handleAnimationStep();
    }
    actionAfterBrushEnd.current = undefined;
  };

  useEffect(() => {
    status.current = 'idle';
    setAnimationData([]);
  }, [search]);

  return (
    <SimulatorCTX.Provider
      value={{
        search,
        state,
        ...query.data,
        animationData,
        start,
        end,
        onBrush,
        onBrushEnd,
        pause,
        unpause,
        status: status.current,
        isLoading: query.isLoading || tokens.isLoading,
        isSuccess: query.isSuccess,
        isError: query.isError || tokens.isError,
        timer,
        playbackSpeed: playbackSpeed.current,
        setPlaybackSpeed,
        errorMsg: (query.error?.message as string) ?? undefined,
      }}
    >
      {children}
    </SimulatorCTX.Provider>
  );
};
