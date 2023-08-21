import { PortfolioToken } from 'components/strategies/portfolio';
import { useExplorer } from 'components/explorer';
import { PathNames } from 'libs/routing';

export const ExplorerTypePortfolioTokenPage = () => {
  const {
    usePairs,
    useWallet,
    routeParams: { address, type, slug },
  } = useExplorer();

  if (!address) return <div>error no address provided</div>;

  const getStrategiesQuery = () => {
    switch (type) {
      case 'wallet': {
        return useWallet.strategiesQuery;
      }
      case 'token-pair': {
        return usePairs.strategiesQuery;
      }
    }
  };

  const strategiesQuery = getStrategiesQuery();

  return (
    <PortfolioToken
      strategiesQuery={strategiesQuery}
      address={address}
      backLinkHref={PathNames.explorerPortfolio(type, slug!)}
    />
  );
};
