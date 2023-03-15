import { EditStrategyMain } from 'components/strategies/edit';
import { useWeb3 } from 'libs/web3';
import { useStore } from 'store';
import { StrategiesPage } from '..';

export const EditStrategyPage = () => {
  const { user } = useWeb3();
  const {
    tokens: { strategy: strategyToEdit },
  } = useStore();

  return user && strategyToEdit ? (
    <EditStrategyMain strategy={strategyToEdit} />
  ) : (
    <StrategiesPage />
  );
};
