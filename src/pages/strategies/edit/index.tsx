import { EditStrategyMain } from 'components/strategies/edit';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { PathNames, useNavigate } from 'libs/routing';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useStore } from 'store';
import { StrategiesPage } from '..';

export const EditStrategyPage = () => {
  const { address: user } = useAccount();
  const {
    strategies: { strategyToEdit },
  } = useStore();
  const navigate = useNavigate<MyLocationGenerics>();

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
