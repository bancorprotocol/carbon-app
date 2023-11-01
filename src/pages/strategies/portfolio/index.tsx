import { Route } from '@tanstack/react-router';
import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useStrategyCtx } from 'hooks/useStrategies';
import { PathNames, useNavigate } from 'libs/routing';
import { myStrategyLayout } from '..';
import { strategyPortflioTokenPage } from './token';

export const StrategiesPortfolioPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  const navigate = useNavigate();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({ to: PathNames.portfolioToken(row.original.token.address) });

  const getHref = (row: PortfolioData) =>
    PathNames.portfolioToken(row.token.address);

  return (
    <PortfolioAllTokens
      strategies={strategies}
      isLoading={isLoading}
      getHref={getHref}
      onRowClick={onRowClick}
    />
  );
};

export const strategyPortflioLayout = new Route({
  getParentRoute: () => myStrategyLayout,
  path: 'strategies/portfolio',
});
export const strategyPortflioPage = new Route({
  getParentRoute: () => strategyPortflioLayout,
  path: '/',
  component: StrategiesPortfolioPage,
});
strategyPortflioLayout.addChildren([
  strategyPortflioPage,
  strategyPortflioTokenPage,
]);
