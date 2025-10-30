import { FC } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { getMarketPricePercentage } from './utils';

interface Props {
  marketPricePercentage: SafeDecimal;
  isBuy?: boolean;
  ignoreMarketPriceWarning?: boolean;
}

export const MarketPricePercent: FC<Props> = ({
  marketPricePercentage,
  isBuy,
  ignoreMarketPriceWarning = false,
}) => {
  if (marketPricePercentage.eq(0)) return null;
  const isAbove = marketPricePercentage.gt(0);
  const percentage = getMarketPricePercentage(marketPricePercentage);
  const isOrderAboveOrBelowMarketPrice =
    (isAbove && isBuy) || (!isAbove && !isBuy);
  const marketPriceWarning =
    !ignoreMarketPriceWarning && isOrderAboveOrBelowMarketPrice;

  return (
    <Tooltip
      iconClassName="size-10"
      element="The percentage difference between the input price and the current market price of the token"
    >
      <span
        className={`rounded-sm bg-main-700 flex items-center gap-5 px-6 py-4 ${
          marketPriceWarning ? 'text-warning' : 'text-white/80'
        }`}
        data-testid="market-price-indication"
      >
        <span className="text-10">{percentage}%</span>
      </span>
    </Tooltip>
  );
};
