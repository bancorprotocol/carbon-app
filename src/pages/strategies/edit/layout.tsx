import { Outlet, useNavigate, useParams, useSearch } from 'libs/routing';
import { useWeb3 } from 'libs/web3';
import { useEffect, useState } from 'react';
import { StrategiesPage } from 'pages/strategies/index';
import { Strategy, useGetUserStrategies } from 'libs/queries';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { EditStrategyProvider } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyLayout } from 'components/strategies/edit/NewEditStrategyLayout';

const url = '/strategies/edit/$strategyId';
export const EditStrategyPageLayout = () => {
  const { user } = useWeb3();
  const { data: strategies, isLoading } = useGetUserStrategies({ user });
  const { strategyId } = useParams({ from: url });
  const { editType } = useSearch({ from: url });
  const [strategy, setStrategy] = useState<Strategy | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user || !strategyId) {
      navigate({ to: '/' });
    } else {
      const strategy = strategies?.find(({ id }) => id === strategyId);
      if (!strategy) navigate({ to: '/' });
      else setStrategy(strategy);
    }
  }, [user, strategyId, strategies, isLoading, navigate]);

  if (!user) return <StrategiesPage />;
  if (isLoading) {
    return <CarbonLogoLoading className="h-100 place-self-center" />;
  }
  if (!strategy) return;
  return (
    <EditStrategyProvider strategy={strategy}>
      <EditStrategyLayout editType={editType}>
        <Outlet />
      </EditStrategyLayout>
    </EditStrategyProvider>
  );
};
