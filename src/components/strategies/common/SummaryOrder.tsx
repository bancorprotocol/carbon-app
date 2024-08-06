import { FC } from 'react';
import { OrderBlock } from './types';
import { cn, tokenAmount } from 'utils/helpers';
import { Token } from 'libs/tokens';

interface Props {
  base: Token;
  quote: Token;
  order: OrderBlock;
  buy?: boolean;
}
export const SummaryOrder: FC<Props> = (props) => {
  const { base, quote, order, buy } = props;
  const isLimit = order.min === order.max;
  return (
    <article className="rounded-8 bg-black px-16 py-12">
      <h3
        className={cn(
          'text-14 font-weight-600',
          buy ? 'text-buy' : 'text-sell'
        )}
      >
        {buy ? 'Buy' : 'Sell'} Overview
      </h3>
      {isLimit ? (
        <div>
          <h4 className="text-12 font-weight-600">
            {buy ? 'Buy' : 'Sell'} Price
          </h4>
          <p>{tokenAmount(order.min, quote)}</p>
          <p>Fiat price here</p>
        </div>
      ) : (
        <>
          <div>
            <h4 className="text-12 font-weight-600">Min Price</h4>
            <p>{tokenAmount(order.min, quote)}</p>
            <p>Fiat price here</p>
          </div>
          <div>
            <h4 className="text-12 font-weight-600">Max Price</h4>
            <p>{tokenAmount(order.max, quote)}</p>
            <p>Fiat price here</p>
          </div>
        </>
      )}
      <div>
        <h4 className="text-12 font-weight-600">Budget</h4>
        <p>{tokenAmount(order.budget, buy ? quote : base)}</p>
        <p>Fiat price here</p>
      </div>
    </article>
  );
};
