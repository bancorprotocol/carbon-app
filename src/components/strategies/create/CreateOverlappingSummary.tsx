import { MarketPriceIndication } from '../marketPriceIndication/MarketPriceIndication';
import { tokenAmount } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { OverlappingOrder } from '../common/types';
import { FC } from 'react';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { isMaxBelowMarket, isMinAboveMarket } from '../overlapping/utils';
import { WarningTooltip } from 'components/common/WarningMessageWithIcon';

interface Props {
  base: Token;
  quote: Token;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
  spread: string;
}

const warningText =
  'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.';

export const CreateOverlappingSummary: FC<Props> = (props) => {
  const { base, quote, order0, order1, spread } = props;
  const { getFiatAsString: getQuoteFiat } = useFiatCurrency(quote);
  const { getFiatAsString: getBaseFiat } = useFiatCurrency(base);
  const aboveMarket = isMinAboveMarket(order0);
  const belowMarket = isMaxBelowMarket(order1);

  const indicationProps = { base, quote, isRange: true, isOverlapping: true };
  return (
    <article className="rounded-8 text-12 grid gap-12 bg-black px-16 py-12">
      <div className="grid grid-flow-col gap-20">
        <div className="grid gap-4">
          <h4 className="font-weight-600 flex items-center gap-8">
            {aboveMarket && <WarningTooltip message={warningText} />}
            Min Price
          </h4>
          <p className="font-weight-500 text-white/80">
            {tokenAmount(order0.min, quote)}
          </p>
          <MarketPriceIndication {...indicationProps} price={order0.min!} buy />
        </div>
        <div className="grid gap-4">
          <h4 className="font-weight-600 flex items-center gap-8">
            {belowMarket && <WarningTooltip message={warningText} />}
            Max Price
          </h4>
          <p className="font-weight-500 text-white/80">
            {tokenAmount(order1.max, quote)}
          </p>
          <MarketPriceIndication {...indicationProps} price={order1.max!} />
        </div>
      </div>
      <div className="grid gap-4">
        <h4 className="font-weight-600">Fee Tier</h4>
        <p className="font-weight-500 text-white/80">{spread}%</p>
      </div>
      <div className="grid grid-flow-col gap-20">
        <div className="grid gap-4">
          <h4 className="font-weight-600 flex items-center gap-4">
            <TokenLogo token={base} size={16} />
            {base.symbol} Budget
          </h4>
          <p className="font-weight-500 text-white/80">
            {tokenAmount(order1.budget, base)}
          </p>
          <p className="break-all text-white/60">
            {getBaseFiat(order1.budget)}
          </p>
        </div>
        <div className="grid gap-4">
          <h4 className="font-weight-600 flex items-center gap-4">
            <TokenLogo token={quote} size={16} />
            {quote.symbol} Budget
          </h4>
          <p className="font-weight-500 text-white/80">
            {tokenAmount(order0.budget, quote)}
          </p>
          <p className="break-all text-white/60">
            {getQuoteFiat(order0.budget)}
          </p>
        </div>
      </div>
    </article>
  );
};
