import { debugPage } from 'libs/routing/routes/debug';
import {
  explorerActivityPage,
  explorerLayout,
  explorerOverviewPage,
  explorerPage,
  explorerPortfolioLayout,
  explorerPortfolioPage,
  explorerPortfolioTokenPage,
  explorerRedirect,
  explorerResultLayout,
  explorerTypePage,
  oldExplorerLayout,
} from 'libs/routing/routes/explorer';
import { privacyPage, termPage } from 'libs/routing/routes/legal';
import {
  myStrategyLayout,
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
  createDisposableStrategyPage,
  createOverlappingStrategyPage,
  createRecurringStrategyPage,
  createStrategyPage,
} from 'libs/routing/routes/strategyCreate';
import {
  editStrategyDisposablePrices,
  editStrategyLayout,
  editStrategyOverlappingPrices,
  editStrategyRecurringPrices,
} from './strategyEdit';
import { tradePage } from 'libs/routing/routes/trade';
import { strategyPage } from 'libs/routing/routes/strategy';

export const routeTree = rootRoute.addChildren([
  termPage,
  privacyPage,
  debugPage,
  tradePage,
  strategyPage,
  createStrategyPage,
  createDisposableStrategyPage,
  createRecurringStrategyPage,
  createOverlappingStrategyPage,
  editStrategyLayout.addChildren([
    editStrategyDisposablePrices,
    editStrategyRecurringPrices,
    editStrategyOverlappingPrices,
  ]),
  oldExplorerLayout,
  explorerLayout.addChildren([
    explorerRedirect,
    explorerPage.addChildren([
      explorerTypePage,
      explorerResultLayout.addChildren([
        explorerOverviewPage,
        explorerPortfolioLayout.addChildren([
          explorerPortfolioPage,
          explorerPortfolioTokenPage,
        ]),
        explorerActivityPage,
      ]),
    ]),
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
]);
