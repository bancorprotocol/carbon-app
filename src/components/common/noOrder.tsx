import { FC } from 'react';
import { ReactComponent as NoOrdersIcon } from 'assets/icons/bars.svg';
import { useTranslation } from 'libs/translations';

type NoOrdersProps = {
  text?: string;
};

export const NoOrders: FC<NoOrdersProps> = ({ text }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-48 w-48 items-center justify-center self-center rounded-full bg-white/10">
        <NoOrdersIcon className="aspect-square w-18" />
      </div>
      <div className="mt-14 text-18 font-weight-500">
        {text || t('pages.trade.errors.error9')}
      </div>
    </div>
  );
};
