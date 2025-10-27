import { Outlet, useNavigate, useParams, useSearch } from 'libs/routing';
import { useWagmi } from 'libs/wagmi';
import { useEffect, useState } from 'react';
import { PortfolioLayout } from 'pages/portfolio/layout';
import { useGetUserStrategies } from 'libs/queries';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { EditStrategyProvider } from 'components/strategies/edit/EditStrategyContext';
import {
  getEditBudgetPage,
  getEditPricesPage,
} from 'components/strategies/edit/utils';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { AnyStrategy } from 'components/strategies/common/types';
import { isGradientStrategy } from 'components/strategies/common/utils';
import { BackButton } from 'components/common/button/BackButton';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/root.module.css';

const titleByType: Record<EditTypes, string> = {
  renew: 'Renew Strategy',
  editPrices: 'Edit Prices',
  deposit: 'Deposit Budgets',
  withdraw: 'Withdraw Budgets',
};

const url = '/strategies/edit/$strategyId';
export const EditStrategyRoot = () => {
  const { user } = useWagmi();
  const { data: strategies, isPending } = useGetUserStrategies({ user });
  const { strategyId } = useParams({ from: url });
  const search = useSearch({ from: url });
  const [strategy, setStrategy] = useState<AnyStrategy | undefined>();
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
    if (!strategy || isGradientStrategy(strategy)) return;
    if (type === 'editPrices' || type === 'renew') {
      const prices = getEditPricesPage(strategy, type);
      navigate({ to: prices.to, search: prices.search, params: (p) => p });
    } else {
      const budget = getEditBudgetPage(strategy, type);
      navigate({ to: budget.to, search: budget.search, params: (p) => p });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, strategy]);

  if (!user) return <PortfolioLayout />;
  if (isPending) {
    return <CarbonLogoLoading className="h-100 place-self-center" />;
  }
  // TODO: support gradient
  if (!strategy || isGradientStrategy(strategy)) return;
  return (
    <EditStrategyProvider strategy={strategy}>
      <div className="mx-auto grid w-full gap-16 p-16 max-w-[1920px]">
        <header className="flex gap-16 items-center">
          <BackButton onClick={() => history.back()} />
          <h1 className="grid place-items-center text-2xl font-medium">
            {titleByType[search.editType]}
          </h1>
        </header>
        <div
          data-edit-budget={
            search.editType !== 'editPrices' && search.editType !== 'renew'
          }
          className={cn(style.root, 'grid gap-16')}
        >
          <Outlet />
        </div>
      </div>
    </EditStrategyProvider>
  );
};
