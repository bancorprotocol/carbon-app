import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useGetTradePairsData } from 'libs/queries';
import { FC, ReactNode, useMemo, createContext, useContext } from 'react';
import { createPairMaps } from 'utils/pairSearch';

export interface PairState {
  pairMap: Map<string, TradePair>;
  nameMap: Map<string, string>;
}

const PairContext = createContext<PairState>({
  pairMap: new Map(),
  nameMap: new Map(),
});

interface PairProviderProps {
  children: ReactNode;
}
export const PairProvider: FC<PairProviderProps> = ({ children }) => {
  const { data: pairs } = useGetTradePairsData();
  const value = useMemo(() => {
    return createPairMaps(pairs);
  }, [pairs]);

  return <PairContext.Provider value={value}>{children}</PairContext.Provider>;
};

export const usePairs = () => useContext(PairContext);
