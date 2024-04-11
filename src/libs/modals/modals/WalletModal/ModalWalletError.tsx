import { FC } from 'react';
import { Imager } from 'components/common/imager/Imager';

type Props = {
  logoUrl?: string;
  name: string;
  error: string;
};

export const ModalWalletError: FC<Props> = ({ logoUrl, error, name }) => {
  return (
    <>
      <Imager alt="Wallet Logo" src={logoUrl} className="w-60" />
      <span>{name} Error:</span>
      <span className="rounded-10 bg-error/20 font-weight-500 text-error px-20 py-10">
        {error}
      </span>
    </>
  );
};
