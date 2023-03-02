import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { UseQueryResult } from 'libs/queries';
import { Token } from 'libs/tokens';
import { BuySellBlock } from './BuySellBlock';
import { OrderCreate } from './useOrder';
import { items } from './variants';

type CreateStrategyOrdersProps = {
  token0: Token | undefined;
  token1: Token | undefined;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string>;
  token1BalanceQuery: UseQueryResult<string>;
  isCTAdisabled: boolean;
  showOrders: boolean;
  createStrategy: () => void;
};

export const CreateStrategyOrders = ({
  token0,
  token1,
  order0,
  order1,
  showOrders,
  createStrategy,
  isCTAdisabled,
  token0BalanceQuery,
  token1BalanceQuery,
}: CreateStrategyOrdersProps) => {
  if (!showOrders) {
    return null;
  }
  return (
    <>
      <m.div variants={items}>
        <BuySellBlock
          token0={token0!}
          token1={token1!}
          order={order0}
          buy
          tokenBalanceQuery={token1BalanceQuery}
          isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
        />
      </m.div>
      <m.div variants={items}>
        <BuySellBlock
          token0={token0!}
          token1={token1!}
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
