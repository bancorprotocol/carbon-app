import { useGetUserStrategies } from 'libs/queries';
import { useWagmi } from 'libs/wagmi';

export const useIsStrategyOwner = (strategyId: string) => {
  const { user } = useWagmi();
  const query = useGetUserStrategies({ user });
  return query.data?.some((strategy) => strategy.id === strategyId);
};
