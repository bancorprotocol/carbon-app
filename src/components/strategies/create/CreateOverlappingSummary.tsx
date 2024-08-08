import { useSearch } from '@tanstack/react-router';
import { MarketPriceIndication } from '../marketPriceIndication/MarketPriceIndication';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';
import { tokenAmount } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { OverlappingOrder } from '../common/types';
import { FC } from 'react';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

interface Props {
  base: Token;
  quote: Token;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
  spread: string;
}

export const CreateOverlappingSummary: FC<Props> = (props) => {
  const { base, quote, order0, order1, spread } = props;
  const search = useSearch({ strict: false }) as TradeOverlappingSearch;
  const { getFiatAsString } = useFiatCurrency(quote);

  const indicationProps = { base, quote, isRange: true, isOverlapping: true };
  return (
    <article className="rounded-8 grid gap-4 bg-black px-16 py-12">
      <div className="text-12">
        <h4 className="font-weight-600">Min Price</h4>
        <p className="font-weight-500 text-white/80">
          {tokenAmount(search.min, quote)}
        </p>
        <MarketPriceIndication {...indicationProps} price={order0.min!} buy />
      </div>
      <div className="text-12">
        <h4 className="font-weight-600">Max Price</h4>
        <p className="font-weight-500 text-white/80">
          {tokenAmount(search.min, quote)}
        </p>
        <MarketPriceIndication {...indicationProps} price={order1.max!} />
      </div>
      <div className="text-12">
        <h4 className="font-weight-600">Fee Tier</h4>
        <p className="font-weight-500 text-white/80">{spread}%</p>
      </div>
      <div className="text-12">
        <h4 className="font-weight-600 flex items-center gap-8">
          <TokenLogo token={quote} size={16} />
          {quote.symbol} Budget
        </h4>
        <p className="font-weight-500 text-white/80">
          {tokenAmount(order0.budget, quote)}
        </p>
        <p className="break-all text-white/60">
          {getFiatAsString(order0.budget)}
        </p>
      </div>
      <div className="text-12">
        <h4 className="font-weight-600 flex items-center gap-8">
          <TokenLogo token={base} size={16} />
          {base.symbol} Budget
        </h4>
        <p className="font-weight-500 text-white/80">
          {tokenAmount(order1.budget, quote)}
        </p>
        <p className="break-all text-white/60">
          {getFiatAsString(order1.budget)}
        </p>
      </div>
      {/* {warning && <Warning message={warning} />} */}
    </article>
  );
};
