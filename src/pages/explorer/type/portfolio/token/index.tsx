import { PortfolioToken } from 'components/strategies/portfolio';
import { useExplorer } from 'components/explorer';

export const ExplorerTypePortfolioTokenPage = () => {
  const {
    usePairs,
    useWallet,
    routeParams: { address, type },
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

  return (
    <PortfolioToken strategiesQuery={getStrategiesQuery()} address={address} />
  );
};
