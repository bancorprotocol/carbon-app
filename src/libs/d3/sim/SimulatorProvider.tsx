import { SimulatorData, SimulatorReturn, useGetSimulator } from 'libs/queries';
import { useSearch } from 'libs/routing';
import { isNil } from 'lodash';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { wait } from 'utils/helpers';

type SimulationStatus = 'running' | 'paused' | 'ended' | 'idle';

interface SimulatorProviderCTX extends Partial<SimulatorReturn> {
  status: SimulationStatus;
  start: () => void;
  pauseToggle: () => void;
  end: () => void;
  animationData: SimulatorData[];
  isLoading: boolean;
  isError: boolean;
  timer: string;
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

export const SimulatorProvider: FC<SimulatorProviderProps> = ({ children }) => {
  const search = useSearch({ from: '/simulator/result' });
  const query = useGetSimulator(search);
  const [animationData, setAnimationData] = useState<SimulatorData[]>([]);
  const [timer, setTimer] = useState('');
  const status = useRef<SimulationStatus>('idle');
  const animationFrame = useRef<number>(0);
  // const [animationFrame, setAnimationFrame] = useState(0);

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

    console.log('status', status);

    if (status.current === 'paused' || status.current === 'ended') {
      console.log('Simulator animation canceled, paused or ended.');
      return;
    }

    handleFPS();

    const perFrame = 1;
    const startSlice = perFrame * animationFrame.current;
    const endSlice = startSlice + perFrame;

    // setAnimationFrame(animationFrame + 1);
    animationFrame.current = animationFrame.current + 1;

    if (endSlice >= query.data.data.length - 1) {
      status.current = 'ended';
      setAnimationData(query.data.data);
      return;
    }

    console.log('animationFrame', animationFrame);

    setAnimationData(query.data.data.slice(0, endSlice));
    await wait(75);
    requestAnimationFrame(handleAnimationStep);
  }, [query.data, status]);

  const start = () => {
    if (status.current === 'running') {
      return;
    }
    setAnimationData([]);
    animationFrame.current = 0;
    status.current = 'running';
    handleAnimationStep();
  };

  const pauseToggle = () => {
    if (status.current === 'paused') {
      status.current = 'running';
      handleAnimationStep();
    } else if (status.current === 'running') {
      status.current = 'paused';
    }
  };

  const end = () => {
    status.current = 'ended';
    setAnimationData(query.data?.data || []);
  };

  return (
    <SimulatorCTX.Provider
      value={{
        ...query.data,
        animationData,
        start,
        pauseToggle,
        end,
        status: status.current,
        isLoading: query.isLoading,
        isError: query.isError,
        timer,
      }}
    >
      {children}
    </SimulatorCTX.Provider>
  );
};
