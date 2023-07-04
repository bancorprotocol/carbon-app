import { useTranslation } from 'libs/translations';
import { FC } from 'react';

type Props = {
  baseSymbol: string;
  quoteSymbol: string;
};
export const ModalTradeRoutingHeader: FC<Props> = ({
  baseSymbol,
  quoteSymbol,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={
        'text-secondary bg-body grid grid-cols-3 gap-10 rounded-t-10 rounded-b-4 px-20 pt-15 pb-12'
      }
    >
      <div>{baseSymbol}</div>
      <div>{quoteSymbol}</div>
      <div>{t('modals.tradeRouting.section1.header1')}</div>
    </div>
  );
};
