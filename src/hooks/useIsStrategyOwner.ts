import { useGetUserStrategies } from 'libs/queries';
import { useWeb3 } from 'libs/web3';

export const useIsStrategyOwner = (strategyId: string) => {
  const { user } = useWeb3();
  const query = useGetUserStrategies({ user });
  return query.data?.some((strategy) => strategy.id === strategyId);
};
