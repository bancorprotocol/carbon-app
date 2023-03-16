import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { UseQueryResult } from 'libs/queries';
import { Token } from 'libs/tokens';
import { BuySellBlock } from './BuySellBlock';
import { OrderCreate } from './useOrder';
import { items } from './variants';

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
      <m.div variants={items}>
        <Button
          variant={'success'}
          size={'lg'}
          fullWidth
          onClick={createStrategy}
          disabled={isCTAdisabled}
        >
          Create Strategy
        </Button>
      </m.div>
    </>
  );
};
