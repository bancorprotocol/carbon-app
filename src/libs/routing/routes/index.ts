import { debugPage } from 'libs/routing/routes/debug';
import {
  explorerActivityPage,
  explorerLayout,
  explorerPortfolioPage,
  explorerDistributionPage,
  explorerDistributionTokenPage,
  explorerPairsPage,
  oldExplorer,
} from 'libs/routing/routes/explorer';
import { privacyPage, termPage } from 'libs/routing/routes/legal';
import {
  portfolioLayout,
  oldCreateStrategies,
  portfolioPairsPage,
  portfolioActivityPage,
  portfolioStrategiesPage,
  portfolioDistributionPage,
  portfolioDistributionTokenPage,
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
import { liquidityMatrixPage } from './liquidity-matrix';
import { landingPage } from './landing';

export const routeTree = rootRoute.addChildren([
  termPage,
  privacyPage,
  debugPage,
  tradePage,
  cartPage,
  landingPage,
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
  oldExplorer,
  portfolioLayout.addChildren([
    portfolioPairsPage,
    portfolioStrategiesPage,
    portfolioDistributionPage,
    portfolioDistributionTokenPage,
    portfolioActivityPage,
  ]),
  simulatorRootRoute.addChildren([
    simulatorInputRootRoute.addChildren([
      simulatorInputRecurringRoute,
      simulatorInputOverlappingRoute,
    ]),
    simulatorResultRoute,
  ]),
  liquidityMatrixPage,
]);
