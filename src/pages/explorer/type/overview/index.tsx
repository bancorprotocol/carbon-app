import { StrategyContent } from 'components/strategies/overview';
import { useExplorer } from 'components/explorer';

export const ExplorerTypeOverviewPage = () => {
  const {
    usePairs,
    useWallet,
    routeParams: { type },
  } = useExplorer();

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

  return <StrategyContent strategies={strategiesQuery} isExplorer />;
};
