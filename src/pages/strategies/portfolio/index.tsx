import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useStrategyCtx } from 'hooks/useStrategies';
import { ToOptions, useNavigate } from '@tanstack/react-router';
import { Pathnames } from 'libs/routing';

export type GetPortfolioTokenHref = (row: PortfolioData) => {
  href: Pathnames;
  params: ToOptions['params'];
};

export const getPortfolioTokenHref: GetPortfolioTokenHref = (row) => ({
  href: '/strategies/portfolio/token/$address',
  params: { address: row.token.address },
});

export const StrategiesPortfolioPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  const navigate = useNavigate();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: '/strategies/portfolio/token/$address',
      params: { address: row.original.token.address },
    });

  return (
    <PortfolioAllTokens
      strategies={strategies}
      isLoading={isLoading}
      getHref={getPortfolioTokenHref}
      onRowClick={onRowClick}
    />
  );
};
