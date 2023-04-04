import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { carbonEvents } from 'services/googleTagManager';

export const WalletConnect = () => {
  const { openModal } = useModal();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-32 text-36">
      <IconWallet className="h-80 w-80" />
      Connect Wallet
      <Button
        className="w-[200px]"
        variant={'secondary'}
        onClick={() => {
          openModal('wallet', undefined);
          carbonEvents.wallet.walletConnectPopupView(undefined);
        }}
      >
        Connect
      </Button>
    </div>
  );
};
