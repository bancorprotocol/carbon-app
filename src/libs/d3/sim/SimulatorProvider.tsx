import { SimulatorReturn } from 'libs/queries';
import { createContext, FC, ReactNode, useContext } from 'react';

interface SimulatorContext extends SimulatorReturn {}

const defaultValue: SimulatorContext = {
  data: [],
  bounds: {
    bidMin: 0,
    bidMax: 0,
    askMin: 0,
    askMax: 0,
  },
};

const SimulatorCTX = createContext(defaultValue);

export const useSimulator = () => {
  return useContext(SimulatorCTX);
};

interface SimulatorProviderProps extends SimulatorReturn {
  children: ReactNode;
}

export const SimulatorProvider: FC<SimulatorProviderProps> = ({
  children,
  ...props
}) => {
  return (
    <SimulatorCTX.Provider value={props}>{children}</SimulatorCTX.Provider>
  );
};
