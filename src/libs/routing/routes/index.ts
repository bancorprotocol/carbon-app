import { debugPage } from 'libs/routing/routes/debug';
import {
  explorerActivityPage,
  explorerLayout,
  explorerPortfolioPage,
  explorerDistributionPage,
  explorerDistributionTokenPage,
  explorerPairsPage,
} from 'libs/routing/routes/explorer';
import { privacyPage, termPage } from 'libs/routing/routes/legal';
import {
  portfolioLayout,
  oldCreateStrategies,
  portfolioPairsPage,
  strategyActivityPage,
  strategyOverviewPage,
  strategyPortfolioLayout,
  strategyPortfolioPage,
  strategyPortfolioTokenPage,
} from 'libs/routing/routes/portfolio';
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
import { liquidityMatrixPage } from './liquidity-matrix';

const rootRedirect = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: (ctx) => {
    redirect({ to: '/trade', throw: true, search: ctx.search });
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
  explorerLayout.addChildren([
    explorerPairsPage,
    explorerPortfolioPage,
    explorerDistributionPage.addChildren([explorerDistributionTokenPage]),
    explorerActivityPage,
  ]),
  portfolioLayout.addChildren([
    portfolioPairsPage,
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
  liquidityMatrixPage,
]);
