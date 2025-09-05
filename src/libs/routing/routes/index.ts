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
import { createRoute } from '@tanstack/react-router';
import { liquidityMatrixPage } from './liquidity-matrix';
import { TradeList } from 'pages/home';
import { searchValidator } from '../utils';
import * as v from 'valibot';

const rootRedirect = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TradeList,
  validateSearch: searchValidator({
    type: v.optional(v.picklist(['orders', 'liquidity'])),
    level: v.optional(v.picklist(['basic', 'advanced', 'professional'])),
  }),
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
  liquidityMatrixPage,
]);
