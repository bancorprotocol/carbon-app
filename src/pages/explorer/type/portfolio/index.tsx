import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useGetPairStrategies, useGetUserStrategies } from 'libs/queries';
import { useMatch, useNavigate } from 'libs/routing';
import { config } from 'services/web3/config';

export const ExplorerTypePortfolioPage = () => {
  const {
    params: { type, search },
  } = useMatch();
  const navigate = useNavigate();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: `/explorer/${type}/${search}/portfolio/token/${row.original.token.address}`,
    });

  const getHref = (row: PortfolioData) =>
    `/explorer/${type}/${search}/portfolio/token/${row.token.address}`;

  // TODO check search is valid address
  //const strategiesByUserQuery = useGetUserStrategies({ user: search });
  const strategiesByPairQuery = useGetPairStrategies({
    token1: config.tokens.ETH.toLowerCase(),
    token0: config.tokens.DAI.toLowerCase(),
  });

  switch (type) {
    case 'wallet': {
      return (
        <>
          <div>Explorer Wallet Portfolio Page</div>
          <div>user: {search}</div>
          <PortfolioAllTokens
            strategiesQuery={strategiesByPairQuery}
            onRowClick={onRowClick}
            getHref={getHref}
          />
          ;
        </>
      );
    }
    case 'token-pair': {
      return (
        <>
          <div>Explorer Token Pair Portfolio Page</div>
          <div>token pair: {search}</div>
          <pre>{JSON.stringify(strategiesByPairQuery.data, null, 2)}</pre>
        </>
      );
    }
  }

  return <div>ups</div>;
};
