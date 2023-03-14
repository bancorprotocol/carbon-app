import { WalletConnect } from 'components/common/walletConnect';
import { EditStrategyMain } from 'components/strategies/edit';
import { useWeb3 } from 'libs/web3';

export const EditStrategyPage = () => {
  const { user } = useWeb3();

  return user ? <EditStrategyMain /> : <WalletConnect />;
};
