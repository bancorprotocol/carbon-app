import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useGetUserStrategies } from 'libs/queries';
import { PathNames, useNavigate } from 'libs/routing';
import { useWeb3 } from 'libs/web3';

export const StrategiesPortfolioPage = () => {
  const { user } = useWeb3();
  const strategiesQuery = useGetUserStrategies({ user });
  const navigate = useNavigate();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({ to: PathNames.portfolioToken(row.original.token.address) });

  const getHref = (row: PortfolioData) =>
    PathNames.portfolioToken(row.token.address);

  return (
    <PortfolioAllTokens
      strategiesQuery={strategiesQuery}
      getHref={getHref}
      onRowClick={onRowClick}
    />
  );
};
