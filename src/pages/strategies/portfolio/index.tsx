import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useStrategyCtx } from 'hooks/useStrategies';
import { PathNames, useNavigate } from 'libs/routing';

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
