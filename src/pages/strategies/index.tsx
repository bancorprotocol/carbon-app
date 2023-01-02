import { useWeb3 } from 'web3';
import { WalletConnect } from 'components/common/walletConnect';
import { StrategyContent } from 'components/strategies/overview';

export const StrategiesPage = () => {
  const { user } = useWeb3();

  return user ? <StrategyContent /> : <WalletConnect />;
};
