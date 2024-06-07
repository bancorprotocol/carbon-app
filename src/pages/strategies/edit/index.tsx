import { EditStrategyMain } from 'components/strategies/edit';
import { useNavigate, useParams } from 'libs/routing';
import { useWagmi } from 'libs/wagmi';
import { useEffect, useState } from 'react';
import { StrategiesPage } from '..';
import { Strategy, useGetUserStrategies } from 'libs/queries';

export const EditStrategyPage = () => {
  const { user } = useWagmi();
  const { data: strategies, isPending } = useGetUserStrategies({ user });
  const { strategyId } = useParams({ from: '/strategies/edit/$strategyId' });
  const [strategy, setStrategy] = useState<Strategy>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (!user || !strategyId) {
      navigate({ to: '/' });
    } else {
      const strategy = strategies?.find(({ id }) => id === strategyId);
      if (strategy) setStrategy(strategy);
      else navigate({ to: '/' });
    }
  }, [user, strategyId, strategies, isPending, navigate]);

  if (!user) return <StrategiesPage />;
  return <EditStrategyMain strategy={strategy} isPending={isPending} />;
};
