import { ReactComponent as IconDisconnect } from 'assets/icons/disconnect.svg';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
import { ReactComponent as IconCoinbaseLogo } from 'assets/logos/coinbase.svg';
import { ReactComponent as IconETHLogo } from 'assets/logos/ethlogo.svg';
import { ReactComponent as IconGnosisLogo } from 'assets/logos/gnosis.svg';
import { ReactComponent as IconImposterLogo } from 'assets/logos/imposter.svg';
import { ReactComponent as IconMetaMaskLogo } from 'assets/logos/metamask.svg';
import { ReactComponent as IconWalletConnectLogo } from 'assets/logos/walletConnect.svg';
import { Button } from 'components/common/button';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { DropdownMenu, useMenuCtx } from 'components/common/dropdownMenu';
import { useModal } from 'hooks/useModal';
import { useWeb3 } from 'libs/web3';
import { FC, useMemo } from 'react';
import { carbonEvents } from 'services/events';
import { useStore } from 'store';
import { cn, shortenString } from 'utils/helpers';
import { useGetEnsFromAddress } from 'libs/queries/chain/ens';

const iconProps = { className: 'w-20' };

const WalletIcon = ({ isImposter }: { isImposter: boolean }) => {
  const { selectedWallet } = useStore();

  if (isImposter) {
    return <IconImposterLogo {...iconProps} />;
  }

  switch (selectedWallet) {
    case 'injected':
      return <IconMetaMaskLogo {...iconProps} />;
    case 'walletConnect':
      return <IconWalletConnectLogo {...iconProps} />;
    case 'coinbaseWallet':
      return <IconCoinbaseLogo {...iconProps} />;
    case 'gnosisSafe':
      return <IconGnosisLogo {...iconProps} />;
    default:
      return <IconWallet {...iconProps} />;
  }
};

export const MainMenuRightWallet: FC = () => {
  const { user, isSupportedNetwork, isImposter, isUserBlocked } = useWeb3();
  const { openModal } = useModal();

  const onClickOpenModal = () => {
    carbonEvents.navigation.navWalletConnectClick(undefined);
    openModal('wallet', undefined);
  };

  const { data: ensName } = useGetEnsFromAddress(user || '');

  const buttonVariant = useMemo(() => {
    if (isUserBlocked) return 'error-light';
    if (!isSupportedNetwork) return 'error-light';
    return 'secondary';
  }, [isSupportedNetwork, isUserBlocked]);

  const buttonText = useMemo(() => {
    if (isUserBlocked) return 'Wallet Blocked';
    if (!isSupportedNetwork) return 'Wrong Network';
    if (!user) return 'Connect Wallet';
    return shortenString(ensName || user);
  }, [ensName, isSupportedNetwork, isUserBlocked, user]);

  const buttonIcon = useMemo(() => {
    if (isUserBlocked) return <IconWarning {...iconProps} />;
    if (!isSupportedNetwork) return <IconWarning {...iconProps} />;
    if (!user) return <IconWallet {...iconProps} />;
    return <WalletIcon isImposter={isImposter} />;
  }, [isSupportedNetwork, isUserBlocked, user, isImposter]);

  if (user) {
    return (
      <DropdownMenu
        placement="bottom-end"
        className="rounded-[10px] p-8"
        button={(attr) => (
          <button
            {...attr}
            className={cn(
              buttonStyles({ variant: buttonVariant }),
              'flex items-center space-x-10 pl-20'
            )}
            onClick={(e) => {
              carbonEvents.navigation.navWalletClick(undefined);
              attr.onClick(e);
            }}
            data-testid="user-wallet"
          >
            {buttonIcon}
            <span>{buttonText}</span>
          </button>
        )}
      >
        <ConnectedMenu />
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant={buttonVariant}
      onClick={onClickOpenModal}
      className="flex items-center space-x-10"
    >
      {buttonIcon}
      <span>{buttonText}</span>
    </Button>
  );
};

const ConnectedMenu: FC = () => {
  const { toaster } = useStore();
  const { setMenuOpen } = useMenuCtx();
  const { user, disconnect, isSupportedNetwork, switchNetwork } = useWeb3();

  const onDisconnect = async () => {
    disconnect();
    carbonEvents.wallet.walletDisconnect({
      address: user,
    });
  };

  const copyAddress = async () => {
    if (!user) return;
    await navigator.clipboard.writeText(user);
    setMenuOpen(false);
    toaster.addToast('Address copied in Clipboard 👍');
  };

  return (
    <div
      role="menu"
      className="w-[180px] space-y-10 font-weight-400 text-white"
    >
      {isSupportedNetwork ? (
        <>
          <div className="flex w-full items-center space-x-10 p-8 font-weight-400">
            <IconETHLogo className="w-16" />
            <span>Ethereum Network</span>
          </div>
          <button
            role="menuitem"
            className="hover:bg-body flex w-full items-center space-x-10 rounded-6 p-8"
            onClick={copyAddress}
          >
            <IconCopy className="w-16" />
            <span>Copy Address</span>
          </button>
        </>
      ) : (
        <button
          role="menuitem"
          className="hover:bg-body flex w-full rounded-6 p-8 text-red/80 hover:text-red"
          onClick={switchNetwork}
        >
          Switch Network
        </button>
      )}
      <button
        role="menuitem"
        className="hover:bg-body flex w-full items-center space-x-10 rounded-6 p-8"
        onClick={onDisconnect}
      >
        <IconDisconnect className="w-16" />
        <span>Disconnect</span>
      </button>
    </div>
  );
};
