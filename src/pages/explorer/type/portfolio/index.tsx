import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useGetUserStrategies } from 'libs/queries';
import { useMatch, useNavigate } from 'libs/routing';

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

  const strategiesQuery = useGetUserStrategies({ user: search });

  switch (type) {
    case 'wallet': {
      return (
        <>
          <div>Explorer Wallet Portfolio Page</div>
          <div>user: {search}</div>
          <PortfolioAllTokens
            strategiesQuery={strategiesQuery}
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
        </>
      );
    }
  }

  return <div>ups</div>;
};
