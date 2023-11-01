import { Route } from '@tanstack/react-router';
import { StrategyContent } from 'components/strategies/overview';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { StrategyNotFound } from 'components/strategies/overview/StrategyNotFound';
import { useStrategyCtx } from 'hooks/useStrategies';
import { myStrategyLayout } from '..';

export const StrategiesOverviewPage = () => {
  const { strategies, isLoading, search } = useStrategyCtx();
  const emptyElement = search ? <StrategyNotFound /> : <StrategyCreateFirst />;

  return (
    <StrategyContent
      strategies={strategies}
      isLoading={isLoading}
      emptyElement={emptyElement}
    />
  );
};

export const strategyOverviewPage = new Route({
  getParentRoute: () => myStrategyLayout,
  path: '/',
  component: StrategiesOverviewPage,
});
