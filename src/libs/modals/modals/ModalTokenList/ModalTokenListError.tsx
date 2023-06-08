import { useTranslation } from 'libs/translations';
import { FC } from 'react';

export const ModalTokenListError: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={'h-[430px] overflow-scroll'}>
      <div
        className={
          'mt-20 flex h-60 w-full items-center justify-center rounded-10 bg-red/30'
        }
      >
        {t('modals.selectTokenPair.error1')}
      </div>
    </div>
  );
};
