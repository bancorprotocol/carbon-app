import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Button, ButtonProps } from 'components/common/button';

export default function ConnectTonWallet(props: ButtonProps) {
  const user = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  if (user) return;
  return <Button {...props} onClick={() => tonConnectUI.openModal()} />;
}
