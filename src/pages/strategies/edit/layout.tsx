import { Outlet, useNavigate, useParams, useSearch } from 'libs/routing';
import { useWagmi } from 'libs/wagmi';
import { useEffect, useState } from 'react';
import { StrategiesPage } from 'pages/strategies/index';
import { Strategy, useGetUserStrategies } from 'libs/queries';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { EditStrategyProvider } from 'components/strategies/edit/EditStrategyContext';
import {
  getEditBudgetPage,
  getEditPricesPage,
} from 'components/strategies/edit/utils';
import { EditTypes } from 'libs/routing/routes/strategyEdit';

const url = '/strategies/edit/$strategyId';
export const EditStrategyPageLayout = () => {
  const { user } = useWagmi();
  const { data: strategies, isPending } = useGetUserStrategies({ user });
  const { strategyId } = useParams({ from: url });
  const search = useSearch({ from: url });
  const [strategy, setStrategy] = useState<Strategy | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (!user || !strategyId) {
      navigate({ to: '/portfolio' });
    } else {
      const strategy = strategies?.find(({ id }) => id === strategyId);
      if (!strategy) navigate({ to: '/portfolio' });
      else setStrategy(strategy);
    }
  }, [user, strategyId, strategies, isPending, navigate]);

  // Support old URLs pattern from before June 2024
  useEffect(() => {
    if (window.location.href.match('/prices|/budget')) return;
    const type = 'type' in search && (search.type as EditTypes);
    if (!type) {
      navigate({ to: '/portfolio' });
      return;
    }
    if (!strategy) return;
    if (type === 'editPrices' || type === 'renew') {
      const prices = getEditPricesPage(strategy, type);
      navigate({ to: prices.to, search: prices.search, params: (p) => p });
    } else {
      const budget = getEditBudgetPage(strategy, type);
      navigate({ to: budget.to, search: budget.search, params: (p) => p });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, strategy]);

  if (!user) return <StrategiesPage />;
  if (isPending) {
    return <CarbonLogoLoading className="h-100 place-self-center" />;
  }
  if (!strategy) return;
  return (
    <EditStrategyProvider strategy={strategy}>
      <Outlet />
    </EditStrategyProvider>
  );
};
