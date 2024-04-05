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
  simulatorInputRoute,
  simulatorRedirect,
  simulatorResultRoute,
  simulatorRootRoute,
} from 'libs/routing/routes/sim';
import {
  createStrategyPage,
  editStrategyPage,
} from 'libs/routing/routes/strategyCreateEdit';
import { tradePage } from 'libs/routing/routes/trade';
import { strategyPage } from 'libs/routing/routes/strategy';

export const routeTree = rootRoute.addChildren([
  termPage,
  privacyPage,
  debugPage,
  tradePage,
  strategyPage,
  createStrategyPage,
  editStrategyPage,
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
    simulatorRedirect,
    simulatorInputRoute,
    simulatorResultRoute,
  ]),
]);
