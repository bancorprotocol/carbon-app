import { FC } from 'react';
import { WalletIcon } from 'components/common/WalletIcon';
import { Button } from 'components/common/button';

type Props = {
  onClick: () => void;
  error: string;
  walletName: string;
  logoUrl?: string;
};

export const ModalWalletError: FC<Props> = ({
  logoUrl,
  error,
  walletName,
  onClick,
}) => {
  return (
    <>
      <WalletIcon selectedWallet={walletName} icon={logoUrl} className="w-60" />
      <span>{walletName} Error:</span>
      <output className="rounded-10 bg-error/20 font-weight-500 text-error px-20 py-10">
        {error}
      </output>
      <Button variant="success" onClick={onClick} fullWidth>
        Back
      </Button>
    </>
  );
};
