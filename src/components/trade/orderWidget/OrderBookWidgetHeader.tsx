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
      <Tooltip
        element={t('pages.trade.section1.tooltips.tooltip1', {
          token: quoteSymbol,
        })}
      >
        <div>
          {t('pages.trade.section1.headers.header1', { token: quoteSymbol })}
        </div>
      </Tooltip>
      <Tooltip
        element={t('pages.trade.section1.tooltips.tooltip2', {
          token: baseSymbol,
        })}
      >
        <div>
          {t('pages.trade.section1.headers.header2', { token: baseSymbol })}
        </div>
      </Tooltip>
      <Tooltip
        element={t('pages.trade.section1.tooltips.tooltip3', {
          token: quoteSymbol,
        })}
      >
        <div className={'text-end'}>
          {t('pages.trade.section1.headers.header3')}
        </div>
      </Tooltip>
    </div>
  );
};
