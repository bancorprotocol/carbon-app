import { UseQueryResult } from '@tanstack/react-query';
import { AnyStrategy } from './common/types';
import { ReactNode } from '@tanstack/react-router';
import { FC } from 'react';
import {
  StrategyContext,
  useFilterStrategies,
  useGetEnrichedStrategies,
} from 'hooks/useStrategies';

interface StrategyProviderProps {
  url: '/explore' | '/portfolio';
  query: UseQueryResult<AnyStrategy[], unknown>;
  children: ReactNode;
}
export const StrategyProvider: FC<StrategyProviderProps> = (props) => {
  const { data, isPending } = useGetEnrichedStrategies(props.query);
  const strategies = useFilterStrategies(props.url, data);

  return (
    <StrategyContext.Provider value={{ strategies, isPending }}>
      {props.children}
    </StrategyContext.Provider>
  );
};
