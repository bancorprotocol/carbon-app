import { useModal } from 'modals';
import { Button } from 'components/button';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';

export const WalletConnect = () => {
  const { openModal } = useModal();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-32 text-36">
      <IconWallet className="h-80 w-80" />
      Connect Wallet
      <Button
        className="w-[200px]"
        variant={'secondary'}
        onClick={() => openModal('wallet', undefined)}
      >
        Connect
      </Button>
    </div>
  );
};
