import { debugPage } from 'libs/routing/routes/debug';
import {
  explorerLayout,
  explorerOverviewPage,
  explorerPage,
  explorerPortfolioLayout,
  explorerPortfolioPage,
  explorerPortfolioTokenPage,
  explorerRedirect,
  explorerResultLayout,
  explorerTypePage,
} from 'libs/routing/routes/explorer';
import { privacyPage, termPage } from 'libs/routing/routes/legal';
import {
  myStrategyLayout,
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

export const routeTree = rootRoute.addChildren([
  termPage,
  privacyPage,
  debugPage,
  tradePage,
  createStrategyPage,
  editStrategyPage,
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
      ]),
    ]),
  ]),
  myStrategyLayout.addChildren([
    strategyOverviewPage,
    strategyPortfolioLayout.addChildren([
      strategyPortfolioPage,
      strategyPortfolioTokenPage,
    ]),
  ]),
  simulatorRootRoute.addChildren([
    simulatorRedirect,
    simulatorInputRoute,
    simulatorResultRoute,
  ]),
]);
