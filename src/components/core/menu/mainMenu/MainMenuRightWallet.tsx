import { ReactComponent as IconDisconnect } from 'assets/icons/disconnect.svg';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconCoinbaseLogo } from 'assets/logos/coinbase.svg';
import { ReactComponent as IconETHLogo } from 'assets/logos/ethlogo.svg';
import { ReactComponent as IconGnosisLogo } from 'assets/logos/gnosis.svg';
import { ReactComponent as IconImposterLogo } from 'assets/logos/imposter.svg';
import { ReactComponent as IconMetaMaskLogo } from 'assets/logos/metamask.svg';
import { ReactComponent as IconWalletConnectLogo } from 'assets/logos/walletConnect.svg';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useModal } from 'hooks/useModal';
import { ConnectionType, useWeb3 } from 'libs/web3';
import { FC, useMemo } from 'react';
import { carbonEvents } from 'services/events';
import { useStore } from 'store';
import { shortenString } from 'utils/helpers';

const iconProps = { className: 'w-20' };

const WalletIcon = ({ isImposter }: { isImposter: boolean }) => {
  const { selectedWallet } = useStore();

  if (isImposter) {
    return <IconImposterLogo {...iconProps} />;
  }

  switch (selectedWallet) {
    case ConnectionType.INJECTED:
      return <IconMetaMaskLogo {...iconProps} />;
    case ConnectionType.WALLET_CONNECT:
      return <IconWalletConnectLogo {...iconProps} />;
    case ConnectionType.COINBASE_WALLET:
      return <IconCoinbaseLogo {...iconProps} />;
    case ConnectionType.GNOSIS_SAFE:
      return <IconGnosisLogo {...iconProps} />;
    default:
      return <IconWallet {...iconProps} />;
  }
};

export const MainMenuRightWallet: FC = () => {
  const {
    user,
    disconnect,
    isSupportedNetwork,
    isImposter,
    isUserBlocked,
    switchNetwork,
  } = useWeb3();
  const { openModal } = useModal();

  const onClickOpenModal = () => {
    carbonEvents.navigation.navWalletConnectClick(undefined);
    openModal('wallet', undefined);
  };

  const onDisconnect = async () => {
    disconnect();
    carbonEvents.wallet.walletDisconnect({
      address: user,
    });
  };

  const buttonVariant = useMemo(() => {
    if (isUserBlocked) return 'error';
    if (!isSupportedNetwork) return 'error';
    return 'secondary';
  }, [isSupportedNetwork, isUserBlocked]);

  const buttonText = useMemo(() => {
    if (isUserBlocked) return 'Wallet Blocked';
    if (!isSupportedNetwork) return 'Wrong Network';
    if (!user) return 'Connect Wallet';
    return shortenString(user);
  }, [isSupportedNetwork, isUserBlocked, user]);

  const buttonIcon = useMemo(() => {
    if (isUserBlocked) return <IconWarning {...iconProps} />;
    if (!isSupportedNetwork) return <IconWarning {...iconProps} />;
    if (!user) return <IconWallet {...iconProps} />;
    return <WalletIcon isImposter={isImposter} />;
  }, [isSupportedNetwork, isUserBlocked, user, isImposter]);

  if (user) {
    return (
      <DropdownMenu
        offset={24}
        placement="bottom-end"
        className="rounded-[10px] p-8"
        button={(attr) => (
          <Button
            variant={buttonVariant}
            className="flex items-center space-x-10 pl-20"
            {...attr}
            onClick={(e) => {
              carbonEvents.navigation.navWalletClick(undefined);
              attr.onClick(e);
            }}
          >
            {buttonIcon}
            <span>{buttonText}</span>
          </Button>
        )}
      >
        <div className={'w-[180px] space-y-10 font-weight-400 text-white'}>
          {isSupportedNetwork ? (
            <div
              className={
                'flex w-full items-center space-x-10 p-8 font-weight-400'
              }
            >
              <IconETHLogo className={'w-16'} />
              <span>Ethereum Network</span>
            </div>
          ) : (
            <button
              onClick={switchNetwork}
              className={
                'hover:bg-body flex w-full rounded-6 p-8 text-red/80  hover:text-red'
              }
            >
              Switch Network
            </button>
          )}
          <button
            onClick={onDisconnect}
            className={
              'hover:bg-body flex w-full items-center space-x-10 rounded-6 p-8'
            }
          >
            <IconDisconnect className={'w-16'} />
            <span>Disconnect</span>
          </button>
        </div>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant={buttonVariant}
      onClick={onClickOpenModal}
      className={'flex items-center space-x-10'}
    >
      {buttonIcon}
      <span>{buttonText}</span>
    </Button>
  );
};
