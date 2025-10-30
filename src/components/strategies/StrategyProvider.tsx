import { AnyStrategy } from './common/types';
import { ReactNode } from '@tanstack/react-router';
import { FC } from 'react';
import {
  QueryLike,
  StrategyContext,
  useGetEnrichedStrategies,
} from 'hooks/useStrategies';

interface StrategyProviderProps {
  url: '/explore' | '/portfolio';
  query: QueryLike<AnyStrategy[] | AnyStrategy>;
  children: ReactNode;
}
export const StrategyProvider: FC<StrategyProviderProps> = (props) => {
  const { data, isPending } = useGetEnrichedStrategies(props.query);
  return (
    <StrategyContext.Provider value={{ strategies: data, isPending }}>
      {props.children}
    </StrategyContext.Provider>
  );
};
