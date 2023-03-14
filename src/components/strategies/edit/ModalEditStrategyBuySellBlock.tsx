import { FC } from 'react';
import { Token } from 'libs/tokens';
import { ModalEditStrategyAllocatedBudget } from '../../../libs/modals/modals/ModalEditStrategy/ModalEditStrategyAllocatedBudget';
import { LimitRangeSection } from 'components/strategies/create/BuySellBlock/LimitRangeSection';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { EditTypes } from './EditStrategyMain';

export const ModalEditStrategyBuySellBlock: FC<{
  base: Token;
  quote: Token;
  order: OrderCreate;
  balance?: string;
  buy?: boolean;
  type: EditTypes;
}> = ({ base, quote, balance, buy, order, type }) => {
  return (
    <div
      className={`bg-secondary w-full rounded-l-6 border-l-2 p-20 text-12 ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
    >
      <LimitRangeSection
        {...{
          token0: base,
          token1: quote,
          balance,
          buy,
          order,
          title: `${buy ? 'Buy' : 'Sell'} ${base.symbol} with ${quote.symbol}`,
          inputTitle: (
            <div className="text-white/60">
              Enter Price{' '}
              <span className={'text-white/80'}>
                ({quote.symbol} <span className="text-white/60">per 1 </span>
                {base.symbol})
              </span>
            </div>
          ),
        }}
      />
      <div className="pt-10">
        <ModalEditStrategyAllocatedBudget
          {...{
            order,
            base,
            quote,
            balance,
            buy,
            type,
          }}
        />
      </div>
    </div>
  );
};
