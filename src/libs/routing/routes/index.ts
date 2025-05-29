import { debugPage } from 'libs/routing/routes/debug';
import {
  explorerActivityPage,
  explorerLayout,
  explorerOverviewPage,
  explorerPortfolioLayout,
  explorerPortfolioPage,
  explorerPortfolioTokenPage,
  explorerRedirect,
  explorerResultLayout,
  oldTradePairExplorer,
  oldWalletExplorer,
} from 'libs/routing/routes/explorer';
import { privacyPage, termPage } from 'libs/routing/routes/legal';
import {
  myStrategyLayout,
  oldCreateStrategies,
  strategyActivityPage,
  strategyOverviewPage,
  strategyPortfolioLayout,
  strategyPortfolioPage,
  strategyPortfolioTokenPage,
} from 'libs/routing/routes/myStrategies';
import { rootRoute } from 'libs/routing/routes/root';
import {
  simulatorInputOverlappingRoute,
  simulatorInputRecurringRoute,
  simulatorInputRootRoute,
  simulatorResultRoute,
  simulatorRootRoute,
} from 'libs/routing/routes/sim';
import {
  editStrategyLayout,
  editPricesDisposable,
  editPricesOverlapping,
  editPricesRecurring,
  editBudgetDisposable,
  editBudgetOverlapping,
  editBudgetRecurring,
  editPrice,
} from './strategyEdit';
import tradePage from 'libs/routing/routes/trade';
import {
  strategyPage,
  strategyPageRedirect,
  strategyPageRoot,
} from 'libs/routing/routes/strategy';
import { cartPage } from './cart';
import { createRoute, redirect } from '@tanstack/react-router';

const rootRedirect = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    redirect({ to: '/trade', throw: true });
  },
});

export const routeTree = rootRoute.addChildren([
  termPage,
  privacyPage,
  debugPage,
  tradePage,
  cartPage,
  strategyPageRoot.addChildren([strategyPage, strategyPageRedirect]),
  oldCreateStrategies,
  editStrategyLayout.addChildren([
    editPrice.addChildren([
      editPricesDisposable,
      editPricesOverlapping,
      editPricesRecurring,
    ]),
    editBudgetDisposable,
    editBudgetOverlapping,
    editBudgetRecurring,
  ]),
  oldTradePairExplorer,
  oldWalletExplorer,
  explorerLayout.addChildren([
    explorerResultLayout.addChildren([
      explorerOverviewPage,
      explorerPortfolioLayout.addChildren([
        explorerPortfolioPage,
        explorerPortfolioTokenPage,
      ]),
      explorerActivityPage,
    ]),
    explorerRedirect,
  ]),
  myStrategyLayout.addChildren([
    strategyOverviewPage,
    strategyPortfolioLayout.addChildren([
      strategyPortfolioPage,
      strategyPortfolioTokenPage,
    ]),
    strategyActivityPage,
  ]),
  simulatorRootRoute.addChildren([
    simulatorInputRootRoute.addChildren([
      simulatorInputRecurringRoute,
      simulatorInputOverlappingRoute,
    ]),
    simulatorResultRoute,
  ]),
  rootRedirect,
]);
