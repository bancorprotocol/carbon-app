import { FC } from 'react';
import { WalletIcon } from 'components/common/WalletIcon';

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
      <output className="rounded-lg bg-error/20 font-medium text-error px-20 py-10">
        {error}
      </output>
      <button className="btn-on-surface" onClick={onClick}>
        Back
      </button>
    </>
  );
};
