import { Route } from '@tanstack/react-router';
import { PortfolioToken } from 'components/strategies/portfolio';
import { useStrategyCtx } from 'hooks/useStrategies';
import { PathNames, useParams } from 'libs/routing';
import { strategyPortflioLayout } from '..';

export const StrategiesPortfolioTokenPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  const { address } = useParams({ strict: false });

  return (
    <PortfolioToken
      strategies={strategies}
      isLoading={isLoading}
      address={address as string}
      backLinkHref={PathNames.portfolio}
    />
  );
};

export const strategyPortflioTokenPage = new Route({
  getParentRoute: () => strategyPortflioLayout,
  path: 'token/$address',
  component: StrategiesPortfolioTokenPage,
});
