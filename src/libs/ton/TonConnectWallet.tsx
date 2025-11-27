import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Button } from 'components/common/button';
import { ButtonProps } from 'react-day-picker';

export default function ConnectTonWallet(props: ButtonProps) {
  const user = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  if (user) return;
  return <Button {...props} onClick={() => tonConnectUI.openModal()} />;
}
