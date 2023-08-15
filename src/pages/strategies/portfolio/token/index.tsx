import { PortfolioToken } from 'components/strategies/portfolio';
import { useGetUserStrategies } from 'libs/queries';
import { PathNames, useMatch } from 'libs/routing';
import { useWeb3 } from 'libs/web3';

export const StrategiesPortfolioTokenPage = () => {
  const { user } = useWeb3();
  const {
    params: { address },
  } = useMatch();

  const strategiesQuery = useGetUserStrategies({ user });

  return (
    <PortfolioToken
      strategiesQuery={strategiesQuery}
      address={address}
      backLinkHref={PathNames.portfolio}
    />
  );
};
