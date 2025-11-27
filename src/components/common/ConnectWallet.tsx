import { lazy } from 'react';
import { useModal } from 'hooks/useModal';
import { useAccount } from 'wagmi';
import { Button, ButtonProps } from './button';
import config from 'config';

const TonConnectWallet = lazy(() => import('libs/ton/TonConnectWallet'));

export const ConnectWallet = (props: ButtonProps) => {
  if (config.network.name === 'TON') {
    return <TonConnectWallet {...props} />;
  } else {
    return <ConnectWagmiWallet {...props} />;
  }
};

const ConnectWagmiWallet = (props: ButtonProps) => {
  const { address } = useAccount();
  const { openModal } = useModal();
  if (address) return;
  return <Button {...props} onClick={() => openModal('wallet')} />;
};
