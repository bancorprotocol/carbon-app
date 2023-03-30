import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { UseQueryResult } from 'libs/queries';
import { Token } from 'libs/tokens';
import { BuySellBlock } from './BuySellBlock';
import { OrderCreate } from './useOrder';
import { items } from './variants';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useBudgetWarning } from '../useBudgetWarning';
import { sendEvent } from 'services/googleTagManager';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

type CreateStrategyOrdersProps = {
  base: Token | undefined;
  quote: Token | undefined;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string>;
  token1BalanceQuery: UseQueryResult<string>;
  isCTAdisabled: boolean;
  createStrategy: () => void;
};

export const CreateStrategyOrders = ({
  base,
  quote,
  order0,
  order1,
  createStrategy,
  isCTAdisabled,
  token0BalanceQuery,
  token1BalanceQuery,
}: CreateStrategyOrdersProps) => {
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(quote);
  const fiatValueBaseUsd = getFiatValueBase(order0.budget, true).toString();
  const fiatValueQuoteUsd = getFiatValueQuote(order1.budget, true).toString();
  const showBudgetWarning = useBudgetWarning(
    base,
    quote,
    order0.budget,
    order1.budget
  );

  const onCreateStrategy = () => {
    sendEvent('strategy', 'strategy_create_click', {
      strategy_buy_low_order_type: order0.isRange ? 'range' : 'limit',
      strategy_base_token: base?.symbol,
      strategy_quote_token: quote?.symbol,
      strategy_buy_low_budget: order0.budget,
      strategy_buy_low_budget_usd: fiatValueBaseUsd,
      strategy_buy_low_token_price: order0.price,
      strategy_buy_low_token_min_price: order0.min,
      strategy_buy_low_token_max_price: order0.max,
      strategy_sell_high_order_type: order1.isRange ? 'range' : 'limit',
      strategy_sell_high_budget: order1.budget,
      strategy_sell_high_budget_usd: fiatValueQuoteUsd,
      strategy_sell_high_token_price: order1.price,
      strategy_sell_high_token_min_price: order1.min,
      strategy_sell_high_token_max_price: order1.max,
    });
    createStrategy();
  };
  return (
    <>
      <m.div variants={items}>
        <BuySellBlock
          base={base!}
          quote={quote!}
          order={order0}
          buy
          tokenBalanceQuery={token1BalanceQuery}
          isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
        />
      </m.div>
      <m.div variants={items}>
        <BuySellBlock
          base={base!}
          quote={quote!}
          order={order1}
          tokenBalanceQuery={token0BalanceQuery}
          isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
        />
      </m.div>
      {showBudgetWarning && (
        <div
          className={'font-auto flex items-center gap-6 px-25 text-warning-500'}
        >
          <div>
            <IconWarning className={'h-14 w-14'} />
          </div>
          <span className="font-mono text-12">
            Strategies with low budget might be ignored during trading due to
            gas considerations
          </span>
        </div>
      )}
      <m.div variants={items}>
        <Button
          variant={'success'}
          size={'lg'}
          fullWidth
          onClick={onCreateStrategy}
          disabled={isCTAdisabled}
        >
          Create Strategy
        </Button>
      </m.div>
    </>
  );
};
