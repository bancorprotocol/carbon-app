import { StrategyContent } from 'components/strategies/overview';
import { useGetPairStrategies, useGetUserStrategies } from 'libs/queries';
import { useMatch } from 'libs/routing';
import { config } from 'services/web3/config';

export const ExplorerTypeOverviewPage = () => {
  const {
    params: { type, search },
  } = useMatch();

  // TODO check search is valid address
  const strategiesByUserQuery = useGetUserStrategies({
    user: type === 'wallet' ? search : undefined,
  });
  const strategiesByPairQuery = useGetPairStrategies({
    token1: config.tokens.ETH.toLowerCase(),
    token0: config.tokens.DAI.toLowerCase(),
  });

  switch (type) {
    case 'wallet': {
      return (
        <>
          <div>Explorer Wallet Overview Page</div>
          <div>user: {search}</div>
          <StrategyContent strategies={strategiesByUserQuery} />
        </>
      );
    }
    case 'token-pair': {
      return (
        <>
          <div>Explorer Token Pair Overview Page</div>
          <div>token pair: {search}</div>
          <StrategyContent strategies={strategiesByPairQuery} />
        </>
      );
    }
  }

  return <div>ups</div>;
};
