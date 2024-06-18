import { Strategy } from 'libs/queries';
import { FC, ReactNode, createContext, useContext } from 'react';

interface EditStrategyCtx {
  strategy: Strategy;
}
export const EditStrategyContext = createContext<EditStrategyCtx>({
  strategy: undefined,
} as any);

interface Props {
  strategy: Strategy;
  children: ReactNode;
}
export const EditStrategyProvider: FC<Props> = ({ strategy, children }) => {
  return (
    <EditStrategyContext.Provider value={{ strategy }}>
      {children}
    </EditStrategyContext.Provider>
  );
};

export const useEditStrategyCtx = () => useContext(EditStrategyContext);
