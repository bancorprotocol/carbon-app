import { FC } from 'react';
import BigNumber from 'bignumber.js';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useTranslation } from 'react-i18next';

type MarketPriceIndicationProps = {
  marketPricePercentage: BigNumber;
  isRange?: boolean;
};

export const MarketPriceIndication: FC<MarketPriceIndicationProps> = ({
  marketPricePercentage,
  isRange = false,
}) => {
  const { t } = useTranslation();

  if (marketPricePercentage.eq(0)) {
    return null;
  }
  const isAbove = marketPricePercentage.gt(0);

  const getMarketPricePercentage = () => {
    if (marketPricePercentage.gte(99.99)) {
      return '>99.99';
    }
    if (marketPricePercentage.lte(-99.99)) {
      return '99.99';
    }
    if (marketPricePercentage.lte(0.01) && isAbove) {
      return '<0.01';
    }

    return isAbove
      ? marketPricePercentage.toFixed(2)
      : marketPricePercentage.times(-1).toFixed(2);
  };

  const percentage = getMarketPricePercentage();

  const getMarketIndicationText = () => {
    const translationsOptions = {
      percentage,
      interpolation: { escapeValue: false },
    };
    if (isRange) {
      return isAbove
        ? t('common.contents.content12', translationsOptions)
        : t('common.contents.content11', translationsOptions);
    }
    return isAbove
      ? t('common.contents.content14', translationsOptions)
      : t('common.contents.content13', translationsOptions);
  };

  return (
    <div
      className={`flex items-center gap-5 rounded-6 bg-emphasis py-4 px-6 text-white/60`}
      data-testid="market-price-indication"
    >
      <div className="font-mono text-10">{getMarketIndicationText()}</div>
      <Tooltip
        iconClassName="h-10 w-10"
        element={t('common.tooltips.tooltip8')}
      />
    </div>
  );
};
