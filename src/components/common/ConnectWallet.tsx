import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useModal } from 'hooks/useModal';
import { useAccount } from 'wagmi';
import config from 'config';
import { Button, ButtonProps } from './button';

export const ConnectWallet = (props: ButtonProps) => {
  if (config.network.name === 'TON') {
    return <ConnectTonWallet {...props} />;
  } else {
    return <ConnectWagmiWallet {...props} />;
  }
};

const ConnectWagmiWallet = (props: ButtonProps) => {
  const { address } = useAccount();
  const { openModal } = useModal();
  if (address) return;
  return <Button {...props} onClick={() => openModal('wallet', undefined)} />;
};

const ConnectTonWallet = (props: ButtonProps) => {
  const user = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  if (user) return;
  return <Button {...props} onClick={() => tonConnectUI.openModal()} />;
};
