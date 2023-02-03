import { Imager } from 'components/common/imager/Imager';
import { FC } from 'react';

type Props = {
  logoUrl?: string;
  name: string;
};

export const ModalWalletLoading: FC<Props> = ({ name, logoUrl }) => {
  return (
    <>
      <Imager
        alt={'Wallet Logo'}
        src={logoUrl}
        className={'w-60 animate-pulse'}
      />
      <span>connecting to {name} ...</span>
    </>
  );
};
