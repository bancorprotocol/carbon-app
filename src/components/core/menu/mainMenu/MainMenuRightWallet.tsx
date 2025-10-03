import { ReactComponent as IconDisconnect } from 'assets/icons/disconnect.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
import { Button } from 'components/common/button';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { DropdownMenu, useMenuCtx } from 'components/common/dropdownMenu';
import { useModal } from 'hooks/useModal';
import { useWagmi } from 'libs/wagmi';
import { FC, useMemo } from 'react';
import { useStore } from 'store';
import { cn, shortenString } from 'utils/helpers';
import { useGetEnsFromAddress } from 'libs/queries/chain/ens';
import { WalletIcon } from 'components/common/WalletIcon';

const iconProps = { className: 'w-20 hidden lg:block' };

export const MainMenuRightWallet: FC = () => {
  const {
    user,
    isSupportedNetwork,
    imposterAccount,
    isUserBlocked,
    currentConnector,
  } = useWagmi();
  const { openModal } = useModal();
  const selectedWallet = currentConnector?.name;

  const onClickOpenModal = () => openModal('wallet', undefined);

  const { data: ensName } = useGetEnsFromAddress(user || '');

  const buttonVariant = useMemo(() => {
    if (isUserBlocked) return 'error';
    if (!isSupportedNetwork) return 'error';
    if (!user) return 'success';
    return 'secondary';
  }, [isSupportedNetwork, isUserBlocked, user]);

  const buttonText = useMemo(() => {
    if (isUserBlocked) return 'Wallet Blocked';
    if (!isSupportedNetwork) return 'Wrong Network';
    if (!user) return 'Launch App';
    return shortenString(ensName || user);
  }, [ensName, isSupportedNetwork, isUserBlocked, user]);

  const buttonIcon = useMemo(() => {
    if (isUserBlocked) return <IconWarning {...iconProps} />;
    if (!isSupportedNetwork) return <IconWarning {...iconProps} />;
    if (!user) return;
    return (
      <WalletIcon
        className="w-20"
        isImposter={!!imposterAccount}
        selectedWallet={selectedWallet}
        icon={currentConnector?.icon}
      />
    );
  }, [
    isUserBlocked,
    isSupportedNetwork,
    user,
    imposterAccount,
    selectedWallet,
    currentConnector?.icon,
  ]);

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
              'flex items-center gap-10 px-16 py-8',
            )}
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
      className="flex items-center gap-10 px-12"
    >
      {buttonIcon}
      <span>{buttonText}</span>
    </Button>
  );
};

const ConnectedMenu: FC = () => {
  const { toaster } = useStore();
  const { setMenuOpen } = useMenuCtx();
  const { user, disconnect, isSupportedNetwork, switchNetwork } = useWagmi();
  const copyAddress = async () => {
    if (!user) return;
    await navigator.clipboard.writeText(user);
    setMenuOpen(false);
    toaster.addToast('Address copied in Clipboard 👍');
  };

  return (
    <div role="menu" className="font-normal space-y-10 text-white">
      {isSupportedNetwork ? (
        <>
          <button
            role="menuitem"
            className="rounded-sm flex w-full items-center space-x-10 p-8 hover:bg-black-gradient"
            onClick={copyAddress}
          >
            <IconCopy className="w-16" />
            <span>Copy Address</span>
          </button>
        </>
      ) : (
        <button
          role="menuitem"
          className="rounded-sm text-error/80 hover:text-error flex w-full p-8 hover:bg-black-gradient"
          onClick={switchNetwork}
        >
          Switch Network
        </button>
      )}
      <button
        role="menuitem"
        className="rounded-sm flex w-full items-center space-x-10 p-8 hover:bg-black-gradient"
        onClick={disconnect}
      >
        <IconDisconnect className="w-16" />
        <span>Disconnect</span>
      </button>
    </div>
  );
};
