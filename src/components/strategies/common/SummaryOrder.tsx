import { FC } from 'react';
import { OrderBlock } from './types';
import { cn, tokenAmount } from 'utils/helpers';
import { Token } from 'libs/tokens';
import { MarketPriceIndication } from '../marketPriceIndication/MarketPriceIndication';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Warning } from 'components/common/WarningMessageWithIcon';

interface Props {
  base: Token;
  quote: Token;
  order: OrderBlock;
  buy?: boolean;
  warning?: string;
}
export const SummaryOrder: FC<Props> = (props) => {
  const { base, quote, order, buy, warning } = props;
  const isRange = order.min !== order.max;
  const indicationProps = { base, quote, buy, isRange };
  const { getFiatAsString } = useFiatCurrency(quote);

  return (
    <article className="rounded-8 grid gap-4 bg-black px-16 py-12">
      <h3
        className={cn(
          'text-14 font-weight-600',
          buy ? 'text-buy' : 'text-sell'
        )}
      >
        {buy ? 'Buy' : 'Sell'} Overview
      </h3>
      {isRange ? (
        <>
          <div className="text-12">
            <h4 className="font-weight-600">Min Price</h4>
            <p className="font-weight-500 text-white/80">
              {tokenAmount(order.min, quote)}
            </p>
            <MarketPriceIndication {...indicationProps} price={order.min} />
          </div>
          <div className="text-12">
            <h4 className="font-weight-600">Max Price</h4>
            <p className="font-weight-500 text-white/80">
              {tokenAmount(order.max, quote)}
            </p>
            <MarketPriceIndication {...indicationProps} price={order.max} />
          </div>
        </>
      ) : (
        <div className="text-12">
          <h4 className="font-weight-600">{buy ? 'Buy' : 'Sell'} Price</h4>
          <p className="font-weight-500 text-white/80">
            {tokenAmount(order.min, quote)}
          </p>
          <MarketPriceIndication {...indicationProps} price={order.min} />
        </div>
      )}
      <div className="text-12">
        <h4 className="font-weight-600">Budget</h4>
        <p className="font-weight-500 text-white/80">
          {tokenAmount(order.budget, buy ? quote : base)}
        </p>
        <p className="break-all text-white/60">
          {getFiatAsString(order.budget)}
        </p>
      </div>
      {warning && <Warning message={warning} />}
    </article>
  );
};
