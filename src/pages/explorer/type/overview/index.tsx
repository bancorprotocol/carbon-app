import { StrategyContent } from 'components/strategies/overview';
import { useExplorer } from 'components/explorer/useExplorer';

export const ExplorerTypeOverviewPage = () => {
  const {
    usePairs,
    useWallet,
    routeParams: { type },
  } = useExplorer();

  switch (type) {
    case 'wallet': {
      return <StrategyContent strategies={useWallet.strategiesQuery} />;
    }
    case 'token-pair': {
      return <StrategyContent strategies={usePairs.strategiesQuery} />;
    }
  }
};
