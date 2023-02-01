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

export const MainMenuRightWallet: FC = () => {
  const { user, disconnect, isSupportedNetwork } = useWeb3();
  const { openModal } = useModal();

  const onClickOpenModal = () => openModal('wallet', undefined);

  if (!isSupportedNetwork) {
    return (
      <Button variant="error" className={'flex items-center space-x-10'}>
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
            onClick={onClick}
            className={'flex items-center space-x-10'}
          >
            <IconMetaMaskLogo className={'w-20'} />
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
          <button onClick={disconnect} className={'hover:text-white'}>
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
