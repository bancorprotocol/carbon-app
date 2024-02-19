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
      <span className="bg-error/20 rounded-10 px-20 py-10 font-weight-500 text-error">
        {error}
      </span>
    </>
  );
};
