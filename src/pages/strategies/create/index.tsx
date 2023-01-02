import { WalletConnect } from 'components/common/walletConnect';
import { CreateStrategy } from 'components/strategies/create';
import { useWeb3 } from 'libs/web3';

export const CreateStrategyPage = () => {
  const { user } = useWeb3();

  return user ? (
    <div className={'mx-auto max-w-[350px]'}>
      <CreateStrategy />
    </div>
  ) : (
    <WalletConnect />
  );
};
