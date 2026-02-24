import { MarketPriceIndication } from '../marketPriceIndication/MarketPriceIndication';
import { tokenAmount } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { CreateOverlappingOrder } from '../common/types';
import { FC } from 'react';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { isMaxBelowMarket, isMinAboveMarket } from '../overlapping/utils';
import { WarningTooltip } from 'components/common/WarningMessageWithIcon';

interface Props {
  base: Token;
  quote: Token;
  buy: CreateOverlappingOrder;
  sell: CreateOverlappingOrder;
  spread: string;
}

const warningText =
  'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.';

export const CreateOverlappingSummary: FC<Props> = (props) => {
  const { base, quote, buy, sell, spread } = props;
  const { getFiatAsString: getQuoteFiat } = useFiatCurrency(quote);
  const { getFiatAsString: getBaseFiat } = useFiatCurrency(base);
  const aboveMarket = isMinAboveMarket(buy);
  const belowMarket = isMaxBelowMarket(sell);

  const indicationProps = { base, quote, isRange: true, isOverlapping: true };
  return (
    <article className="rounded-md text-12 grid gap-12 bg-main-900 px-16 py-12">
      <div className="grid grid-flow-col gap-20">
        <div className="grid gap-4">
          <h4 className="font-semibold flex items-center gap-8">
            {aboveMarket && <WarningTooltip message={warningText} />}
            Min Price
          </h4>
          <p className="font-medium text-main-0/80">
            {tokenAmount(buy.min, quote)}
          </p>
          <MarketPriceIndication {...indicationProps} price={buy.min!} isBuy />
        </div>
        <div className="grid gap-4">
          <h4 className="font-semibold flex items-center gap-8">
            {belowMarket && <WarningTooltip message={warningText} />}
            Max Price
          </h4>
          <p className="font-medium text-main-0/80">
            {tokenAmount(sell.max, quote)}
          </p>
          <MarketPriceIndication {...indicationProps} price={sell.max!} />
        </div>
      </div>
      <div className="grid gap-4">
        <h4 className="font-semibold">Fee Tier</h4>
        <p className="font-medium text-main-0/80">{spread}%</p>
      </div>
      <div className="grid grid-flow-col gap-20">
        <div className="grid gap-4">
          <h4 className="font-semibold flex items-center gap-4">
            <TokenLogo token={base} size={16} />
            {base.symbol} Budget
          </h4>
          <p className="font-medium text-main-0/80">
            {tokenAmount(sell.budget, base)}
          </p>
          <p className="break-all text-main-0/60">{getBaseFiat(sell.budget)}</p>
        </div>
        <div className="grid gap-4">
          <h4 className="font-semibold flex items-center gap-4">
            <TokenLogo token={quote} size={16} />
            {quote.symbol} Budget
          </h4>
          <p className="font-medium text-main-0/80">
            {tokenAmount(buy.budget, quote)}
          </p>
          <p className="break-all text-main-0/60">{getQuoteFiat(buy.budget)}</p>
        </div>
      </div>
    </article>
  );
};
