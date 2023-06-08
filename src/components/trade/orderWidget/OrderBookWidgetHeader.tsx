import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useTranslation } from 'libs/translations';
import { FC } from 'react';

type Props = {
  baseSymbol: string;
  quoteSymbol: string;
};

export const OrderBookWidgetHeader: FC<Props> = ({
  baseSymbol,
  quoteSymbol,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={
        'text-secondary bg-body grid grid-cols-3 rounded-t-10 rounded-b-4 px-20 pt-15 pb-12'
      }
    >
      <Tooltip element={`Price points denominated in ${quoteSymbol}`}>
        <div>
          {t('pages.trade.section1.headers.header1', { token: quoteSymbol })}
        </div>
      </Tooltip>
      <Tooltip
        element={`The amount of available ${baseSymbol} tokens in this price point`}
      >
        <div>
          {t('pages.trade.section1.headers.header2', { token: baseSymbol })}
        </div>
      </Tooltip>
      <Tooltip
        element={`The available liquidity in this price point denominated in ${quoteSymbol}`}
      >
        <div className={'text-right'}>
          {t('pages.trade.section1.headers.header3')}
        </div>
      </Tooltip>
    </div>
  );
};
