import { PortfolioToken } from 'components/strategies/portfolio';
import { useGetUserStrategies } from 'libs/queries';
import { useMatch } from 'libs/routing';

export const ExplorerTypePortfolioTokenPage = () => {
  const {
    params: { type, search, address },
  } = useMatch();

  const strategiesQuery = useGetUserStrategies({
    user: type === 'wallet' ? search : undefined,
  });

  switch (type) {
    case 'wallet': {
      return (
        <>
          <div>Explorer Wallet Overview Page</div>
          <div>user: {search}</div>
          <div>address: {address}</div>
          <PortfolioToken strategiesQuery={strategiesQuery} address={address} />
        </>
      );
    }
    case 'token-pair': {
      return (
        <>
          <div>Explorer Token Pair Overview Page</div>
          <div>token pair: {search}</div>
          <div>address: {address}</div>
        </>
      );
    }
  }

  return null;
};
