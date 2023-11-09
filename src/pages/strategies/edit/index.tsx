import { EditStrategyMain } from 'components/strategies/edit';
import { PathNames, useNavigate } from 'libs/routing';
import { useWeb3 } from 'libs/web3';
import { useEffect } from 'react';
import { useStore } from 'store';
import { StrategiesPage } from '..';

export const EditStrategyPage = () => {
  const { user } = useWeb3();
  const {
    strategies: { strategyToEdit },
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !strategyToEdit) {
      navigate({ to: PathNames.strategies });
    }
  }, [user, strategyToEdit, navigate]);

  return user && strategyToEdit ? (
    <EditStrategyMain strategy={strategyToEdit} />
  ) : (
    <StrategiesPage />
  );
};
