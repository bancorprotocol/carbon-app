import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useStrategyCtx } from 'hooks/useStrategies';
import { PathNames } from 'libs/routing';
import { useNavigate } from '@tanstack/react-router';

export const StrategiesPortfolioPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  const navigate = useNavigate();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: '/strategies/portfolio/token/$address',
      params: { address: row.original.token.address },
    });

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
