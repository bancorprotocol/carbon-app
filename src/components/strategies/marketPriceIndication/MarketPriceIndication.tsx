import { FC } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { getMarketPricePercentage } from './utils';

type MarketPriceIndicationProps = {
  marketPricePercentage: SafeDecimal;
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
  const percentage = getMarketPricePercentage(marketPricePercentage);

  return (
    <span
      className="flex items-center gap-5 rounded-6 bg-emphasis py-4 px-6 text-white/60"
      data-testid="market-price-indication"
    >
      <span className="font-mono text-10">
        {percentage}% {isAbove ? 'above' : 'below'} {isRange ? '' : 'market'}
      </span>
      <Tooltip
        iconClassName="h-10 w-10"
        element="The percentage difference between the input price and the current market price of the token"
      />
    </span>
  );
};
