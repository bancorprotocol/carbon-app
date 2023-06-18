import { FC } from 'react';
import BigNumber from 'bignumber.js';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { Tooltip } from 'components/common/tooltip/Tooltip';

type Props = {
  marketPricePercentage: BigNumber;
  isRange?: boolean;
  buy?: boolean;
};

export const MarketPriceIndication: FC<Props> = ({
  marketPricePercentage,
  isRange = false,
}) => {
  const { belowBreakpoint } = useBreakpoints();
  const isAbove = marketPricePercentage.gt(0);

  if (marketPricePercentage.eq(0) || belowBreakpoint('md')) {
    return null;
  }

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
      ? marketPricePercentage.decimalPlaces(2)
      : marketPricePercentage.decimalPlaces(2).times(-1);
  };

  const percentage = getMarketPricePercentage();

  return (
    <div
      className={`flex items-center gap-5 rounded-6 bg-emphasis py-4 px-6 text-white/60 ${
        isRange ? 'w-min' : ''
      }`}
      data-testid="market-price-indication"
    >
      <div className="font-mono text-10">
        {`${percentage}% ${isAbove ? 'above' : 'below'} ${
          isRange ? '' : 'market'
        }`}
      </div>
      <Tooltip
        iconClassName="h-11 w-11"
        element="The percentage difference between the input price and the current market price of the token"
      />
    </div>
  );
};
