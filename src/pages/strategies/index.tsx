import { useWeb3 } from 'web3';
import { WalletConnect } from 'components/walletConnect';
import { StrategyContent } from 'elements/strategies/overview';

export const StrategiesPage = () => {
  const { user } = useWeb3();

  return user ? <StrategyContent /> : <WalletConnect />;
};
