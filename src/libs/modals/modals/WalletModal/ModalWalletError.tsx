import { FC } from 'react';
import { useTranslation } from 'libs/translations';
import { Imager } from 'components/common/imager/Imager';

type Props = {
  logoUrl?: string;
  name: string;
  error: string;
};

export const ModalWalletError: FC<Props> = ({ logoUrl, error, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <Imager alt={'Wallet Logo'} src={logoUrl} className={'w-60'} />
      <span>{t('modals.connectWallet.error1', { error: name })}</span>
      <span
        className={'rounded-10 bg-red/20 px-20 py-10 font-weight-500 text-red'}
      >
        {error}
      </span>
    </>
  );
};
