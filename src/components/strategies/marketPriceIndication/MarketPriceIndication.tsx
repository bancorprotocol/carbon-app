import { FC } from 'react';
import Decimal from 'decimal.js';
import { Tooltip } from 'components/common/tooltip/Tooltip';

type MarketPriceIndicationProps = {
  marketPricePercentage: Decimal;
  isRange?: boolean;
};

export const MarketPriceIndication: FC<MarketPriceIndicationProps> = ({
  marketPricePercentage,
  isRange = false,
}) => {
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

  return (
    <div
      className={`flex items-center gap-5 rounded-6 bg-emphasis py-4 px-6 text-white/60`}
      data-testid="market-price-indication"
    >
      <div className="font-mono text-10">
        {`${percentage}% ${isAbove ? 'above' : 'below'} ${
          isRange ? '' : 'market'
        }`}
      </div>
      <Tooltip
        iconClassName="h-10 w-10"
        element="The percentage difference between the input price and the current market price of the token"
      />
    </div>
  );
};
