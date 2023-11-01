import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useNavigate } from 'libs/routing';
import { useExplorerParams } from 'components/explorer/useExplorerParams';
import { useStrategyCtx } from 'hooks/useStrategies';
import { Route } from '@tanstack/react-router';
import { explorerResultLayout } from 'pages/explorer';
import { explorerPortfolioTokenPage } from './token';

export const ExplorerTypePortfolioPage = () => {
  const navigate = useNavigate();
  const { type, slug } = useExplorerParams();
  const { strategies, isLoading } = useStrategyCtx();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: `/explorer/${type}/${slug}/portfolio/token/${row.original.token.address}`,
    });

  const getHref = (row: PortfolioData) =>
    `/explorer/${type}/${slug}/portfolio/token/${row.token.address}`;

  return (
    <>
      <PortfolioAllTokens
        strategies={strategies}
        isLoading={isLoading}
        onRowClick={onRowClick}
        getHref={getHref}
        isExplorer
      />
    </>
  );
};

export const explorerPortfolioLayout = new Route({
  getParentRoute: () => explorerResultLayout,
  path: 'portfolio',
});

export const explorerPortfolioPage = new Route({
  getParentRoute: () => explorerPortfolioLayout,
  path: '/',
  component: ExplorerTypePortfolioPage,
});
explorerPortfolioLayout.addChildren([
  explorerPortfolioPage,
  explorerPortfolioTokenPage,
]);
