import { ReactComponent as IconDisconnect } from 'assets/icons/disconnect.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconCopy } from 'assets/icons/copy.svg';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useMenuCtx } from 'components/common/dropdownMenu/utils';
import { useWagmi } from 'libs/wagmi';
import { FC, useMemo } from 'react';
import { useStore } from 'store';
import { cn, shortenString } from 'utils/helpers';
import { useGetEnsFromAddress } from 'libs/queries/chain/ens';
import { WalletIcon } from 'components/common/WalletIcon';
import { useNavigate, useRouterState } from '@tanstack/react-router';

const iconClass = 'w-20 hidden sm:block';

export const MainMenuRightWallet: FC = () => {
  const {
    user,
    isSupportedNetwork,
    imposterAccount,
    isUserBlocked,
    currentConnector,
    openConnect,
  } = useWagmi();
  const { location } = useRouterState();
  const selectedWallet = currentConnector?.name;

  const { data: ensName } = useGetEnsFromAddress(user || '');

  const buttonVariant = useMemo(() => {
    if (isUserBlocked) return 'btn-error-gradient text-16';
    if (!isSupportedNetwork) return 'btn-error-gradient text-16';
    if (!user) return 'btn-primary-gradient px-16 py-8 text-16';
    return 'btn-on-background text-16';
  }, [isSupportedNetwork, isUserBlocked, user]);

  const buttonText = useMemo(() => {
    if (isUserBlocked) return 'Wallet Blocked';
    if (!isSupportedNetwork) return 'Wrong Network';
    if (!user) {
      if (location.pathname === '/') return 'Launch App';
      return 'Connect Wallet';
    }
    return shortenString(ensName || user);
  }, [ensName, isSupportedNetwork, isUserBlocked, location.pathname, user]);

  const buttonIcon = useMemo(() => {
    if (isUserBlocked) return <IconWarning className={iconClass} />;
    if (!isSupportedNetwork) return <IconWarning className={iconClass} />;
    if (!user) return;
    return (
      <WalletIcon
        className={iconClass}
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
        className="rounded-2xl p-8"
        button={(attr) => (
          <button
            {...attr}
            className={cn(buttonVariant, 'flex items-center gap-8')}
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
    <button
      onClick={openConnect}
      className={cn(buttonVariant, 'flex items-center gap-8 px-16')}
    >
      {buttonIcon}
      <span>{buttonText}</span>
    </button>
  );
};

const ConnectedMenu: FC = () => {
  const { toaster } = useStore();
  const { setMenuOpen } = useMenuCtx();
  const { user, disconnect, isSupportedNetwork, switchNetwork } = useWagmi();
  const nav = useNavigate();

  const signout = async () => {
    await disconnect();
    nav({ to: '/' });
  };

  const copyAddress = async () => {
    if (!user) return;
    await navigator.clipboard.writeText(user);
    setMenuOpen(false);
    toaster.addToast('Address copied in Clipboard 👍');
  };

  return (
    <div role="menu" className="font-normal grid gap-4 text-white">
      {isSupportedNetwork ? (
        <>
          <button
            role="menuitem"
            className="rounded-sm flex w-full items-center gap-8 p-8 hover:bg-main-900/40"
            onClick={copyAddress}
          >
            <IconCopy className="w-16" />
            <span>Copy Address</span>
          </button>
        </>
      ) : (
        <button
          role="menuitem"
          className="rounded-sm text-error/80 hover:text-error flex w-full p-8 hover:bg-main-900/40"
          onClick={switchNetwork}
        >
          Switch Network
        </button>
      )}
      <button
        role="menuitem"
        className="rounded-sm flex w-full items-center gap-8 p-8 hover:bg-main-900/40"
        onClick={signout}
      >
        <IconDisconnect className="w-16" />
        <span>Disconnect</span>
      </button>
    </div>
  );
};
