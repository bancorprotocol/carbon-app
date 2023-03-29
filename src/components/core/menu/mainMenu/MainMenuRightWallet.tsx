import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { useWeb3 } from 'libs/web3';
import { shortenString } from 'utils/helpers';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconETHLogo } from 'assets/logos/ethlogo.svg';
import { ReactComponent as IconMetaMaskLogo } from 'assets/logos/metamask.svg';
import { ReactComponent as IconCoinbaseLogo } from 'assets/logos/coinbase.svg';
import { ReactComponent as IconGnosisLogo } from 'assets/logos/gnosis.svg';
import { ReactComponent as IconImposterLogo } from 'assets/logos/imposter.svg';
import {
  IS_COINBASE_WALLET,
  IS_IN_IFRAME,
  IS_METAMASK_WALLET,
} from 'libs/web3/web3.utils';
import { sendEvent } from 'services/googleTagManager';

const WalletIcon = ({ isImposter }: { isImposter: boolean }) => {
  const props = { className: 'w-20' };

  if (isImposter) {
    return <IconImposterLogo {...props} />;
  }
  if (IS_IN_IFRAME) {
    return <IconGnosisLogo {...props} />;
  }
  if (IS_METAMASK_WALLET) {
    return <IconMetaMaskLogo {...props} />;
  }
  if (IS_COINBASE_WALLET) {
    return <IconCoinbaseLogo {...props} />;
  }

  return <IconWallet {...props} />;
};

// TODO: Fix that function
const getWalletName = () => {
  if (IS_METAMASK_WALLET) {
    return 'MetaMask';
  }
  if (IS_COINBASE_WALLET) {
    return 'Coinbase Wallet';
  }
  return '';
};

export const MainMenuRightWallet: FC = () => {
  const { user, disconnect, isSupportedNetwork, isImposter } = useWeb3();
  const { openModal } = useModal();

  const onClickOpenModal = () => {
    sendEvent('navigation', 'nav_wallet_connect_click', undefined);
    sendEvent('wallet', 'wallet_connect_popup_view', undefined);
    openModal('wallet', undefined);
  };

  const onDisconnect = async () => {
    disconnect();
    sendEvent('wallet', 'wallet_disconnect', { wallet_name: getWalletName() });
  };

  if (!isSupportedNetwork) {
    return (
      <Button
        variant="error"
        className={'flex items-center space-x-10'}
        disabled
      >
        <IconWarning className={'w-16'} />
        <span>Wrong Network</span>
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu
        placement="bottom-end"
        button={(onClick) => (
          <Button
            variant={'secondary'}
            onClick={() => {
              sendEvent('navigation', 'nav_wallet_click', undefined);
              onClick();
            }}
            className={'flex items-center space-x-10 pl-20'}
          >
            <WalletIcon isImposter={isImposter} />
            <span>{shortenString(user)}</span>
          </Button>
        )}
      >
        <div className={'w-[180px] font-weight-400'}>
          <div className={'flex items-center space-x-10'}>
            <IconETHLogo className={'w-16'} />
            <span>Ethereum Network</span>
          </div>
          <hr className={'my-10 border-t-2 border-silver'} />
          <button onClick={onDisconnect} className={'hover:text-white'}>
            Disconnect
          </button>
        </div>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant={'secondary'}
      onClick={onClickOpenModal}
      className={'flex items-center space-x-10'}
    >
      <IconWallet className={'w-16'} />
      <span>Connect Wallet</span>
    </Button>
  );
};
