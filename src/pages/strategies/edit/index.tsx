import { EditStrategyMain } from 'components/strategies/edit';
import { PathNames, useNavigate, useParams } from 'libs/routing';
import { useWeb3 } from 'libs/web3';
import { useEffect, useState } from 'react';
import { StrategiesPage } from '..';
import { Strategy, useGetUserStrategies } from 'libs/queries';

export const EditStrategyPage = () => {
  const { user } = useWeb3();
  const { data: strategies, isLoading } = useGetUserStrategies({ user });
  const { strategyId } = useParams({ strict: false });
  const [strategy, setStrategy] = useState<Strategy>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user || !strategyId) {
      navigate({ to: PathNames.strategies });
    } else {
      const strategy = strategies?.find(({ id }) => id === strategyId);
      if (strategy) setStrategy(strategy);
      else navigate({ to: PathNames.strategies });
    }
  }, [user, strategyId, strategies, isLoading, navigate]);

  if (!user) return <StrategiesPage />;
  return <EditStrategyMain strategy={strategy} isLoading={isLoading} />;
};
