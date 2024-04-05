import { Route } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { StrategiesPage } from 'pages/strategies';
import { StrategiesActivityPage } from 'pages/strategies/activity';
import { StrategiesOverviewPage } from 'pages/strategies/overview';
import { StrategiesPortfolioPage } from 'pages/strategies/portfolio';
import { StrategiesPortfolioTokenPage } from 'pages/strategies/portfolio/token';

export const myStrategyLayout = new Route({
  getParentRoute: () => rootRoute,
  id: 'my-strategy-layout',
  component: StrategiesPage,
});

export const strategyOverviewPage = new Route({
  getParentRoute: () => myStrategyLayout,
  path: '/',
  component: StrategiesOverviewPage,
});

export const strategyPortfolioLayout = new Route({
  getParentRoute: () => myStrategyLayout,
  path: 'strategies/portfolio',
});

export const strategyPortfolioPage = new Route({
  getParentRoute: () => strategyPortfolioLayout,
  path: '/',
  component: StrategiesPortfolioPage,
});

export const strategyPortfolioTokenPage = new Route({
  getParentRoute: () => strategyPortfolioLayout,
  path: 'token/$address',
  component: StrategiesPortfolioTokenPage,
});

export const strategyActivityPage = new Route({
  getParentRoute: () => myStrategyLayout,
  path: 'strategies/activity',
  component: StrategiesActivityPage,
});
